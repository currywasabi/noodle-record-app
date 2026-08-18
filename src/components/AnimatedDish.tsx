import { useMemo } from "react";
import "./AnimatedDish.css";

interface AnimatedDishProps {
  src: string;
  zoom: number;
  marginBottom: number;
  /** 새로 추가된 그릇(맨 위, 마운트 직후)에만 낙하 애니메이션 재생 */
  animate: boolean;
  /** DOM 순서와 무관하게 쌓인 순서대로 그려지도록 고정하는 z-index (아래=낮음, 위=높음) */
  zIndex: number;
}

const TILT_RANGE_DEG = 14; // -14deg ~ +14deg 사이에서 랜덤 기울기

export default function AnimatedDish({
  src,
  zoom,
  marginBottom,
  animate,
  zIndex,
}: AnimatedDishProps) {
  // 컴포넌트가 처음 마운트될 때 한 번만 랜덤 기울기를 뽑고, 리렌더링돼도 유지
  const tilt = useMemo(() => {
    return (Math.random() * 2 - 1) * TILT_RANGE_DEG;
  }, []);

  return (
    <img
      src={src}
      alt=""
      className={animate ? "dish-drop-animate" : undefined}
      style={
        {
          zoom,
          display: "block",
          marginBottom,
          position: "relative", // z-index가 먹으려면 position 필요
          zIndex,
          "--tilt": `${tilt}deg`,
        } as React.CSSProperties
      }
    />
  );
}
