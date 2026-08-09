import { useState } from "react";
import type { AppTab } from "../types";
import { Top } from "@toss/tds-mobile";

const DISH_IMAGES = [
  "냄비정렬.png",
  "냉면그릇.png",
  "일반그릇.png",
  "컵라면소컵.png",
  "컵라면대컵.png",
  "파스타그릇.png",
];

interface Dish {
  file: string;
}

interface HomePageProps {
  onChangeTab: (tab: AppTab) => void;
}

export default function HomePage({ onChangeTab }: HomePageProps) {
  const [stack, setStack] = useState<Dish[]>([]);

  const addDish = (file: string) => {
    setStack((s) => [...s, { file }]);
  };

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <Top
        title={<Top.TitleParagraph>{stack.length}그릇</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleTextButton>2026년 8월</Top.SubtitleTextButton>
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100px",
          gap: 8,
          margin: "16px 0",
        }}
      >
        {DISH_IMAGES.map((file) => (
          <button key={file} onClick={() => addDish(file)}>
            {file.replace(".png", "")}
          </button>
        ))}
        <button onClick={() => setStack([])}>리셋</button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
        }}
      >
        {stack.map((b, i) => (
          <img
            key={i}
            src={`/image/dishes/${b.file}`}
            alt=""
            style={{ zoom: 0.3, display: "block" }}
          />
        ))}
      </div>
    </div>
  );
}
