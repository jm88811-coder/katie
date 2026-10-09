import type { Metadata, Viewport } from "next";
import MindShell from "@/components/mind/MindShell";

export const metadata: Metadata = {
  title: "마음결 | 생각과 거리를 두는 마음 돌봄",
  description:
    "생각기록지·가치 나침반·명상 훈련으로 생각과 거리를 두는 연습을 하는 마음 돌봄 앱. 모든 기록은 내 기기에만 저장돼요.",
};

export const viewport: Viewport = { themeColor: "#1d4ed8" };

export default function MindLayout({ children }: LayoutProps<"/mind">) {
  return <MindShell>{children}</MindShell>;
}
