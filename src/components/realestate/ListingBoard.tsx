"use client";

import { useState } from "react";
import { DealType, Listing, PropertyType } from "@/lib/data/realestate";

const DEALS: ("전체" | DealType)[] = ["전체", "매매", "전세", "월세"];
const PROPERTIES: ("전체" | PropertyType)[] = ["전체", "아파트", "오피스텔", "빌라", "상가", "원룸"];

const DEAL_STYLE: Record<DealType, string> = {
  매매: "bg-blue-600 text-white",
  전세: "bg-emerald-600 text-white",
  월세: "bg-amber-500 text-white",
};

const PROPERTY_BG: Record<PropertyType, string> = {
  아파트: "from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900",
  오피스텔: "from-violet-100 to-violet-200 dark:from-violet-950 dark:to-violet-900",
  빌라: "from-emerald-100 to-emerald-200 dark:from-emerald-950 dark:to-emerald-900",
  상가: "from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900",
  원룸: "from-rose-100 to-rose-200 dark:from-rose-950 dark:to-rose-900",
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-sm transition ${
        active
          ? "bg-foreground text-background"
          : "border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

export default function ListingBoard({ listings, phone }: { listings: Listing[]; phone: string }) {
  const [deal, setDeal] = useState<(typeof DEALS)[number]>("전체");
  const [property, setProperty] = useState<(typeof PROPERTIES)[number]>("전체");

  const filtered = listings.filter(
    (l) => (deal === "전체" || l.deal === deal) && (property === "전체" || l.property === property),
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {DEALS.map((d) => (
            <Chip key={d} active={deal === d} onClick={() => setDeal(d)}>
              {d}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {PROPERTIES.map((p) => (
            <Chip key={p} active={property === p} onClick={() => setProperty(p)}>
              {p}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 py-12 text-center text-sm text-foreground/60 dark:border-white/15">
          조건에 맞는 매물이 아직 없습니다. 전화 주시면 비공개 매물까지 찾아드릴게요.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <li
              key={l.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-background shadow-sm dark:border-white/10"
            >
              <div className={`relative flex h-36 items-end bg-gradient-to-br p-4 ${PROPERTY_BG[l.property]}`}>
                <span className="text-sm font-medium text-foreground/70">{l.property}</span>
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${DEAL_STYLE[l.deal]}`}>{l.deal}</span>
                  {l.isNew && (
                    <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">NEW</span>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xl font-bold">
                  {l.deal} {l.price}
                </p>
                <h3 className="font-medium">{l.title}</h3>
                <p className="text-sm text-foreground/60">
                  {l.location} · {l.area} · {l.floor}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {l.features.map((f) => (
                    <span key={f} className="rounded bg-black/5 px-2 py-0.5 text-xs text-foreground/70 dark:bg-white/10">
                      {f}
                    </span>
                  ))}
                </div>
                <a
                  href={`tel:${phone}`}
                  className="mt-auto pt-3 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  이 매물 문의하기 →
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
