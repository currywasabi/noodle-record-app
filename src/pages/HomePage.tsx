import { useState } from "react";
import type { AppTab } from "../types";
import { Top } from "@toss/tds-mobile";

interface DishSpec {
  file: string;
}

const DISH_SPECS: DishSpec[] = [
  { file: "라면냄비.png" },
  { file: "냉면그릇.png" },
  { file: "일반그릇.png" },
  { file: "사발면.png" },
  { file: "파스타그릇.png" },
];

type DishFile = (typeof DISH_SPECS)[number]["file"];

// OVERLAP_TABLE[아래 그릇][위 그릇] = 겹치는 정도(px, zoom 0.2 기준)
const OVERLAP_TABLE: Record<DishFile, Record<DishFile, number>> = {
  "라면냄비.png": {
    "라면냄비.png": 190,
    "냉면그릇.png": 38,
    "일반그릇.png": 150,
    "사발면.png": 220,
    "파스타그릇.png": 38,
  },
  "냉면그릇.png": {
    "라면냄비.png": 190,
    "냉면그릇.png": 80,
    "일반그릇.png": 190,
    "사발면.png": 210,
    "파스타그릇.png": 45,
  },
  "일반그릇.png": {
    "라면냄비.png": 150,
    "냉면그릇.png": 20,
    "일반그릇.png": 230,
    "사발면.png": 225,
    "파스타그릇.png": 65,
  },
  "사발면.png": {
    "라면냄비.png": 0,
    "냉면그릇.png": 5,
    "일반그릇.png": 75,
    "사발면.png": 220,
    "파스타그릇.png": 18,
  },
  "파스타그릇.png": {
    "라면냄비.png": 40,
    "냉면그릇.png": 50,
    "일반그릇.png": 65,
    "사발면.png": 60,
    "파스타그릇.png": 60,
  },
};

const DEFAULT_OVERLAP = 20;

function getOverlap(below: DishFile | undefined, above: DishFile): number {
  if (!below) return 0; // 맨 아래 첫 그릇은 겹칠 대상이 없음
  return OVERLAP_TABLE[below]?.[above] ?? DEFAULT_OVERLAP;
}

interface HomePageProps {
  onChangeTab: (tab: AppTab) => void;
}

export default function HomePage({ onChangeTab }: HomePageProps) {
  const [stack, setStack] = useState<DishSpec[]>([]);

  const addDish = (spec: DishSpec) => {
    setStack((s) => [...s, spec]);
  };

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <Top
        title={
          <Top.TitleParagraph size={28}>
            {stack.length}그릇 먹었어요
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleSelector type="arrow">2026년 8월</Top.SubtitleSelector>
        }
      />

      {/* 그릇쌓기 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100px",
            gap: 8,
            margin: "16px 0",
          }}
        >
          {DISH_SPECS.map((spec) => (
            <button key={spec.file} onClick={() => addDish(spec)}>
              <img
                src={`/image/dishes/${spec.file}`}
                alt=""
                style={{ width: "50%", backgroundSize: "cover" }}
              />
              {spec.file.replace(".png", "")}
            </button>
          ))}
          <button onClick={() => setStack([])}>리셋</button>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 64, //하단바 높이
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
          }}
        >
          {stack.map((b, i) => {
            const below = i === 0 ? undefined : stack[i - 1].file;
            const overlap = getOverlap(below, b.file);
            return (
              <img
                key={i}
                src={`/image/dishes/${b.file}`}
                alt=""
                style={{
                  zoom: 0.15,
                  display: "block",
                  marginBottom: -overlap, // i===0일 때 overlap이 0이라 자동으로 안전
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
