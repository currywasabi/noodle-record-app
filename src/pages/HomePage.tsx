import type { AppTab } from "../types";
import { Top, Button, Modal } from "@toss/tds-mobile";
import { useState } from "react";
import { useDishStack, DISH_FILES } from "../hooks/useDishStack";
import DishStack from "../components/DishStack";

interface HomePageProps {
  onChangeTab: (tab: AppTab) => void;
}

export default function HomePage({ onChangeTab }: HomePageProps) {
  const { stack, isReady, addDish, getOverlap } = useDishStack();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: "16px 16px 24px", position: "relative" }}>
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

      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Overlay />
        <Modal.Content
          style={{
            padding: "32px 20px 20px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {DISH_FILES.map((file) => (
            <button
              key={file}
              onClick={() => {
                addDish(file);
                setOpen(false);
              }}
            >
              <img
                src={`/image/dishes/${file}.png`}
                alt=""
                style={{ width: "50%", backgroundSize: "cover" }}
              />
              {file}
            </button>
          ))}
          <Button
            display="block"
            color="primary"
            onClick={() => setOpen(false)}
          >
            확인
          </Button>
        </Modal.Content>
      </Modal>

      <button onClick={() => setOpen(true)} disabled={!isReady}>
        {isReady ? "+ 그릇 추가" : "불러오는 중..."}
      </button>

      <DishStack stack={stack} getOverlap={getOverlap} bottomOffset={64} />
    </div>
  );
}
