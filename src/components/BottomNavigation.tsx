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
        position: "absolute",
        top: "90%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 4,
        background: "#ffffff",
        borderRadius: 999,
        padding: 6,
        boxShadow: "0 8px 20px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)",
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
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              background: active ? "#191f28" : "transparent",
              color: active ? "#ffffff" : "#9ca3af",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
