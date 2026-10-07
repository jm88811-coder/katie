import type { Metadata } from "next";
import { SajuShell } from "@/components/saju/ui";
import { BRAND, FAQ } from "@/lib/saju/content";

export const metadata: Metadata = {
  title: `무료 사주·만세력·오늘의 운세·궁합 | ${BRAND.name}`,
  description: `${BRAND.tagline}. 가입 없이 사주팔자, 오행, 십성, 대운, 오늘의 운세, 2027 신년운세, 궁합까지 무료로 확인하세요.`,
  keywords: ["무료사주", "만세력", "사주팔자", "오늘의 운세", "신년운세", "2027 운세", "궁합", "대운", "오행", "음력 사주"],
  openGraph: { title: `${BRAND.name} — 무료 사주·만세력`, description: BRAND.tagline, locale: "ko_KR", type: "website" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function SajuLayout({ children }: LayoutProps<"/saju">) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SajuShell>{children}</SajuShell>
    </>
  );
}
