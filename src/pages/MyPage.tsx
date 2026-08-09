import type { AppTab } from "../types";

interface MyPageProps {
  onChangeTab: (tab: AppTab) => void;
}

export default function MyPage({ onChangeTab }: MyPageProps) {
  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <div style={{ fontSize: 30, fontWeight: 900, color: "#191f28" }}>MY</div>

      {/* TODO: 도감, 업적, 프로필/레벨, 랭킹 등 */}
    </div>
  );
}
