import type { Metadata } from "next";
import { OFFICE } from "@/lib/data/realestate";

export const metadata: Metadata = {
  title: `${OFFICE.name} | ${OFFICE.tagline}`,
  description: `${OFFICE.name} — 아파트·빌라·오피스텔·상가 매매, 전세, 월세 중개. ${OFFICE.address}`,
};

export default function RealEstateLayout({ children }: LayoutProps<"/realestate">) {
  return children;
}
