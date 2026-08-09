import { useState } from "react";

import "./App.css";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import BottomNavigation from "./components/BottomNavigation";
import type { AppTab } from "./types";

import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";

function App() {
  const [tab, setTab] = useState<AppTab>("home");

  return (
    <TDSMobileAITProvider>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <main style={{ paddingBottom: 80 }}>
          {tab === "home" && <HomePage onChangeTab={setTab} />}
          {tab === "my" && <MyPage onChangeTab={setTab} />}
        </main>

        <BottomNavigation currentTab={tab} onChangeTab={setTab} />
      </div>
    </TDSMobileAITProvider>
  );
}

export default App;
