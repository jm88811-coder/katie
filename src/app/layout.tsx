import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "파운더스토리 | 당신의 이야기가 사업이 됩니다",
  description:
    "이름, 생년월일, 성향, 실패·성공 경험담을 바탕으로 나만의 사업가 여정을 설계하는 AI 코칭 앱",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-black/10 py-6 text-center text-xs text-foreground/50 dark:border-white/10">
          파운더스토리 · 모든 정보는 일반적인 가이드이며, 세무·법률 사안은 반드시 전문가와 상담하세요.
        </footer>
      </body>
    </html>
  );
}
