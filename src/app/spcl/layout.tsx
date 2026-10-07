import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SPCL 콘텐츠 스튜디오 | 조회수가 아닌 고객을 만드는 콘텐츠",
  description:
    "Status·Power·Credibility·Likeness 4가지 콘텐츠로 관심을 신뢰로, 신뢰를 상담으로. 전문직·사업가를 위한 SPCL 콘텐츠 기획 도구.",
  openGraph: {
    title: "SPCL 콘텐츠 스튜디오",
    description: "조회수가 아닌, 고객을 만드는 콘텐츠 전략",
    locale: "ko_KR",
    type: "website",
  },
};

export default function SpclLayout({ children }: LayoutProps<"/spcl">) {
  return (
    <>
      <header className="border-b border-black/10 dark:border-white/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-sm">
          <Link href="/spcl" className="font-bold tracking-tight">
            SPCL <span className="text-violet-600">Studio</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/spcl#proof" className="hover:underline">사례</Link>
            <Link href="/spcl/planner" className="font-semibold text-violet-600 hover:underline">기획 도구</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t border-black/10 py-6 text-center text-xs text-foreground/50 dark:border-white/10">
        SPCL 콘텐츠 스튜디오 · 샘플 수치와 사례는 실제 자료로 교체하세요.
      </footer>
    </>
  );
}
