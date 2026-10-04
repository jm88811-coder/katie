import type { Metadata } from "next";
import { COMPLEXES, OFFICE } from "@/lib/data/realestate";

// '더샵'이 들어간 오산 중개사무소가 5곳 더 있어, 검색어는 '엘리포레'를 중심으로 잡습니다.
export const metadata: Metadata = {
  title: `더샵오산엘리포레 단지 내 부동산 | ${OFFICE.fullName} (오산 서동)`,
  description: `더샵오산엘리포레 아파트 단지 내 상가 101호 엘리포레 부동산. 엘리포레·오산세교 아파트와 분양권 매매·전세·월세, 전세자금대출·양도세 상담, 청년 중개수수료 할인. ☎ ${OFFICE.phone}`,
  keywords: [
    "더샵오산엘리포레",
    "엘리포레 부동산",
    "더샵엘리포레 부동산",
    "오산 서동 부동산",
    "여들동로 부동산",
    "엘리포레 전세",
    "엘리포레 매매",
    ...COMPLEXES.map((c) => c.name),
    "오산 분양권",
  ],
  openGraph: {
    title: `더샵오산엘리포레 단지 내 부동산 | ${OFFICE.name}`,
    description: `${OFFICE.tagline}. 단지 내 상가 101호, ☎ ${OFFICE.phone}`,
    locale: "ko_KR",
    type: "website",
    images: ["/realestate/storefront.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: OFFICE.fullName,
  alternateName: ["엘리포레 부동산", "더샵엘리포레 부동산"],
  description: `더샵오산엘리포레 단지 내 상가 101호 공인중개사사무소. ${OFFICE.tagline}.`,
  telephone: OFFICE.phone,
  image: "/realestate/storefront.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "여들동로 26 상가코너 101호",
    addressLocality: "오산시",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  areaServed: COMPLEXES.map((c) => c.name),
  sameAs: [OFFICE.blogUrl, OFFICE.mapUrl],
};

export default function RealEstateLayout({ children }: LayoutProps<"/realestate">) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
