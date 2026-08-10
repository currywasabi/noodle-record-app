import type { AppTab } from "../types";

const TABS: { key: AppTab; label: string }[] = [
  { key: "home", label: "기록" },
  { key: "my", label: "MY" },
];

interface BottomNavigationProps {
  currentTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
}

export default function BottomNavigation({
  currentTab,
  onChangeTab,
}: BottomNavigationProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        background: "#ffffff",
        borderTop: "1px solid #f2f4f6",
        zIndex: 50,
      }}
    >
      {TABS.map((t) => {
        const active = currentTab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChangeTab(t.key)}
            style={{
              border: "none",
              cursor: "pointer",
              background: "transparent",
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              color: active ? "#191f28" : "#9ca3af",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
