import type { DishFile } from "../hooks/useDishStack";
import AnimatedDish from "./AnimatedDish";

const ASSET_DIR = "/image/dishes";

// 마스크는 원본 이미지 해상도 기준으로 계산되므로, 화면에 그릴 때 축소 비율(zoom)만큼
// 겹침 px 값도 같이 줄여줘야 실제 화면에서 정확히 맞아떨어진다.
const ZOOM = 0.17;

interface DishStackProps {
  stack: DishFile[];
  getOverlap: (below: DishFile | undefined, above: DishFile) => number;
  /** 하단바 높이 등, 스택을 화면 하단에서 얼마나 띄울지 (px) */
  bottomOffset?: number;
}

export default function DishStack({
  stack,
  getOverlap,
  bottomOffset = 64,
}: DishStackProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: bottomOffset,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {stack.map((file, i) => {
        const below = i === 0 ? undefined : stack[i - 1];
        const overlap = getOverlap(below, file);
        const isTop = i === stack.length - 1;

        return (
          <AnimatedDish
            key={i}
            src={`${ASSET_DIR}/${file}.png`}
            zoom={ZOOM}
            marginBottom={i === 0 ? 0 : -overlap}
            animate={isTop}
            zIndex={stack.length - i}
          />
        );
      })}
    </div>
  );
}
