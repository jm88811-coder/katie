import type { Metadata } from "next";
import { OFFICE } from "@/lib/data/realestate";

export const metadata: Metadata = {
  title: `${OFFICE.fullName} | ${OFFICE.tagline}`,
  description: `오산 서동 더샵오산엘리포레 단지 내 상가 101호. 아파트·분양권·상가·토지·주택·공장 매매·전세·월세, 대출·양도세 상담. ☎ ${OFFICE.phone}`,
};

export default function RealEstateLayout({ children }: LayoutProps<"/realestate">) {
  return children;
}
