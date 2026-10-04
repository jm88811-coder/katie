"use client";

import { CATEGORIES, type PropertyType } from "@/lib/data/realestate";
import { CONSULT_TYPE_EVENT } from "@/components/realestate/ConsultForm";

const ICONS: Record<PropertyType, React.ReactNode> = {
  아파트: <path d="M6 28V8h10v20M16 28V4h10v24M3 28h26M9 12h4M9 17h4M9 22h4M19 9h4M19 14h4M19 19h4" />,
  분양권: <path d="M7 4h13l6 6v18H7zM20 4v6h6M11 16h11M11 21h11M11 11h5" />,
  상가: <path d="M4 12l2-7h20l2 7M4 12h24M4 12v16h24V12M13 28v-8h6v8M7 16h4M21 16h4" />,
  토지: <path d="M3 24l7-9 6 6 4-4 9 7zM3 28h26M21 9a3 3 0 1 0 0-.1" />,
  주택: <path d="M4 15L16 5l12 10M7 13v15h18V13M13 28v-8h6v8" />,
  공장: <path d="M3 28V14l7 4v-4l7 4v-4l7 4V6h5v22zM3 28h26M8 23h3M15 23h3" />,
};

export default function CategoryGrid() {
  const pick = (type: PropertyType) => {
    window.dispatchEvent(new CustomEvent(CONSULT_TYPE_EVENT, { detail: type }));
    document.getElementById("consult")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {CATEGORIES.map((c) => (
        <li key={c.type}>
          <button
            type="button"
            onClick={() => pick(c.type)}
            className="group flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-black/10 bg-background p-5 text-left transition hover:-translate-y-0.5 hover:border-red-500 hover:shadow-md dark:border-white/10"
          >
            <svg
              viewBox="0 0 32 32"
              className="h-9 w-9 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {ICONS[c.type]}
            </svg>
            <span className="text-lg font-bold">{c.type}</span>
            <span className="break-keep text-sm leading-snug text-foreground/60">{c.desc}</span>
            <span className="mt-auto text-sm font-semibold text-red-600 group-hover:underline dark:text-red-400">상담 신청 →</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
