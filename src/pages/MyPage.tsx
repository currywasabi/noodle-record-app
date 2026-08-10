import { useState } from "react";
import type { AppTab } from "../types";
import { Top } from "@toss/tds-mobile";

interface MyPageProps {
  onChangeTab: (tab: AppTab) => void;
}

// --- 임시 더미 데이터 (나중에 실제 기록 데이터로 교체) ---
const TASTE_LABELS = [
  "한식면",
  "중식면",
  "일식면",
  "양식면",
  "인스턴트",
  "기타",
];
const TASTE_VALUES = [0.7, 0.3, 0.9, 0.5, 0.6, 0.4]; // 0~1 사이 비율

const ACHIEVEMENTS = [
  { label: "첫 기록 남기기", achieved: true },
  { label: "10그릇 달성", achieved: true },
  { label: "냉면 마스터", achieved: false },
  { label: "일주일 연속 기록", achieved: false },
];

interface Record {
  name: string;
  rating: number;
  date: string;
}

const RECORDS: Record[] = [
  { name: "냉면", rating: 4, date: "2026.08.05" },
  { name: "컵라면(대)", rating: 3, date: "2026.08.03" },
  { name: "파스타", rating: 5, date: "2026.08.01" },
];

// 육각형 좌표 계산 (6축 레이더)
function getHexPoints(values: number[], size = 80, center = 100) {
  return values
    .map((v, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const r = size * v;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");
}

function getOuterHexPoints(size = 80, center = 100) {
  return getHexPoints([1, 1, 1, 1, 1, 1], size, center);
}

export default function MyPage({ onChangeTab }: MyPageProps) {
  const [taste] = useState(TASTE_VALUES);
  const [achievements] = useState(ACHIEVEMENTS);
  const [records] = useState(RECORDS);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <Top title={<Top.TitleParagraph size={28}>MY</Top.TitleParagraph>} />

      {/* 컴포넌트 1 - 육각형 면요리 취향분석 */}
      <div style={{ marginBottom: 24 }}>
        <Top
          title={<Top.TitleParagraph size={22}>내 취향</Top.TitleParagraph>}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "8px 0",
          }}
        >
          <svg width={200} height={200} viewBox="0 0 200 200">
            <polygon
              points={getOuterHexPoints()}
              fill="none"
              stroke="#e5e8eb"
              strokeWidth={1}
            />
            <polygon
              points={getHexPoints(taste)}
              fill="rgba(34,114,235,0.25)"
              stroke="#2272eb"
              strokeWidth={2}
            />
            {TASTE_LABELS.map((label, i) => {
              const angle = (Math.PI / 3) * i - Math.PI / 2;
              const x = 100 + 95 * Math.cos(angle);
              const y = 100 + 95 * Math.sin(angle);
              return (
                <text
                  key={label}
                  x={x}
                  y={y}
                  fontSize={10}
                  fill="#4e5968"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 컴포넌트 2 - 달성/미달성 업적 목록 */}
      <div style={{ marginBottom: 24 }}>
        <Top title={<Top.TitleParagraph size={22}>업적</Top.TitleParagraph>} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {achievements.map((a) => (
            <div
              key={a.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 12,
                background: a.achieved ? "#ebf2ff" : "#f2f4f6",
                color: a.achieved ? "#2272eb" : "#9ca3af",
                fontSize: 14,
              }}
            >
              <span>{a.achieved ? "✅" : "🔒"}</span>
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 컴포넌트 3 - 지금까지 먹은 면요리 이름 / 별점 / 날짜 */}
      <div style={{ marginBottom: 24 }}>
        <Top
          title={<Top.TitleParagraph size={22}>내 기록</Top.TitleParagraph>}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {records.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 12,
                background: "#f9fafb",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#191f28" }}>
                {r.name}
              </span>
              <span style={{ fontSize: 13, color: "#f59e0b" }}>
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
