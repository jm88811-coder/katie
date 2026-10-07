import type { Metadata } from "next";
import Planner from "@/components/spcl/Planner";

export const metadata: Metadata = {
  title: "SPCL 콘텐츠 기획 도구",
  description: "업종과 경험을 입력하면 Status·Power·Credibility·Likeness 콘텐츠 아이디어와 주간 캘린더를 만들어 드립니다.",
};

export default function PlannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold tracking-tight">SPCL 콘텐츠 기획 도구</h1>
      <p className="text-foreground/70">입력은 이 브라우저에만 저장되며 서버로 전송되지 않습니다.</p>
      <Planner />
    </div>
  );
}
