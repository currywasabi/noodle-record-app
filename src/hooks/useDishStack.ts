import { useCallback, useEffect, useRef, useState } from "react";

// ── 그릇 종류 정의 ──────────────────────────────────────────────

export const DISH_FILES = [
  "냉면그릇",
  "라면냄비",
  "사발면",
  "일반그릇",
  "파스타그릇",
] as const;

export type DishFile = (typeof DISH_FILES)[number];

const MASK_DIR = "/image/dishes_mask";
const ALPHA_THRESHOLD = 20;

// 아주 딱 붙어 보이지 않도록, 계산된 최대 겹침에서 이만큼 여유를 뺀다.
const SAFETY_GAP_PX = 15;

// ── 마스크 분석 (알파 채널 → 행별 세그먼트) ──────────────────────

type RowSegments = [number, number][][];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function extractRowSegments(img: HTMLImageElement): RowSegments {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height).data;

  const rows: RowSegments = [];
  for (let y = 0; y < img.height; y++) {
    const segments: [number, number][] = [];
    let start = -1;
    for (let x = 0; x < img.width; x++) {
      const alpha = data[(y * img.width + x) * 4 + 3];
      const opaque = alpha > ALPHA_THRESHOLD;
      if (opaque && start === -1) {
        start = x;
      } else if (!opaque && start !== -1) {
        segments.push([start, x - 1]);
        start = -1;
      }
    }
    if (start !== -1) segments.push([start, img.width - 1]);
    rows.push(segments);
  }
  return rows;
}

function segmentsOverlap(
  a: [number, number][],
  b: [number, number][],
): boolean {
  for (const [as, ae] of a) {
    for (const [bs, be] of b) {
      if (as <= be && bs <= ae) return true;
    }
  }
  return false;
}

/**
 * below(아래 그릇)와 above(위 그릇)의 마스크가 실제로 처음 맞닿는 지점을 찾아
 * 서로 뚫고 들어가지 않는 최대 겹침(px, 마스크 원본 해상도 기준)을 반환한다.
 * 손잡이 달린 냄비처럼 폭이 오르락내리락하는 형태도 정확히 처리하기 위해,
 * offset마다 경계 행 하나만이 아니라 겹치는 구간 전체를 검사한다.
 */
function computeMaxOverlap(
  belowRows: RowSegments,
  aboveRows: RowSegments,
): number {
  // above가 below보다 짧아도(예: 작은 사발면이 깊은 냄비/그릇 안에 들어갈 때),
  // below의 전체 깊이까지 탐색해야 진짜 정지 지점을 찾을 수 있다.
  // above 자신의 키에서 탐색을 멈추면, 충돌을 못 찾은 채로 "100% 파묻힘"이라고
  // 잘못 확정해버려 above의 화면상 높이 기여분이 0이 되는(=붕 뜨는) 버그가 생긴다.
  const maxPossible = belowRows.length;

  for (let offset = 1; offset <= maxPossible; offset++) {
    let collided = false;
    for (let i = 0; i < offset; i++) {
      const belowRow = i < belowRows.length ? belowRows[i] : [];
      const aboveIdx = aboveRows.length - offset + i;
      const aboveRow =
        aboveIdx >= 0 && aboveIdx < aboveRows.length ? aboveRows[aboveIdx] : [];
      if (segmentsOverlap(belowRow, aboveRow)) {
        collided = true;
        break;
      }
    }
    if (collided) return offset - 1;
  }
  return maxPossible;
}

// ── 훅 ──────────────────────────────────────────────────────────

interface UseDishStackResult {
  /** 현재 쌓인 그릇 순서 (index 0 = 맨 아래) */
  stack: DishFile[];
  /** 마스크 분석이 끝나서 겹침 계산이 가능한 상태인지 */
  isReady: boolean;
  /** 맨 위에 그릇 하나 추가 */
  addDish: (file: DishFile) => void;
  /** 맨 위 그릇 하나 제거 */
  undo: () => void;
  /** 스택 전체 초기화 */
  reset: () => void;
  /**
   * below 위에 above를 놓았을 때 실제로 적용해야 할 겹침(px, 원본 마스크 해상도 기준).
   * below가 undefined면(맨 아래 그릇) 0을 반환.
   */
  getOverlap: (below: DishFile | undefined, above: DishFile) => number;
}

export function useDishStack(): UseDishStackResult {
  const [stack, setStack] = useState<DishFile[]>([]);
  const [isReady, setIsReady] = useState(false);

  // 그릇별 마스크 분석 결과 캐시
  const segmentsCache = useRef<Partial<Record<DishFile, RowSegments>>>({});
  // 페어별 겹침 계산 결과 캐시 (같은 조합 다시 계산 안 하도록)
  const overlapCache = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await Promise.all(
        DISH_FILES.map(async (file) => {
          const img = await loadImage(`${MASK_DIR}/${file}_mask.png`);
          if (cancelled) return;
          segmentsCache.current[file] = extractRowSegments(img);
        }),
      );
      if (!cancelled) setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const getOverlap = useCallback(
    (below: DishFile | undefined, above: DishFile): number => {
      if (!below) return 0;

      const key = `${below}__${above}`;
      const cached = overlapCache.current.get(key);
      if (cached !== undefined) return cached;

      const belowSegs = segmentsCache.current[below];
      const aboveSegs = segmentsCache.current[above];
      if (!belowSegs || !aboveSegs) return 0; // 아직 마스크 로딩 전

      const rawOverlap = computeMaxOverlap(belowSegs, aboveSegs);
      const overlap = Math.max(0, rawOverlap - SAFETY_GAP_PX);

      overlapCache.current.set(key, overlap);
      return overlap;
    },
    [],
  );

  const addDish = useCallback((file: DishFile) => {
    setStack((prev) => [...prev, file]);
  }, []);

  const undo = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const reset = useCallback(() => {
    setStack([]);
  }, []);

  return { stack, isReady, addDish, undo, reset, getOverlap };
}
