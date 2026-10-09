"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TABS = [
  { href: "/mind", label: "오늘", icon: "🏠" },
  { href: "/mind/record", label: "생각기록", icon: "📝" },
  { href: "/mind/values", label: "나침반", icon: "🧭" },
  { href: "/mind/meditate", label: "명상", icon: "🍃" },
  { href: "/mind/progress", label: "나의 변화", icon: "📈" },
];

export default function MindShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isActive = (href: string) =>
    href === "/mind" ? pathname === "/mind" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
          <Link href="/mind" className="text-lg font-extrabold tracking-tight text-blue-800">
            마음결
          </Link>
          <Link
            href="/mind/sos"
            className="rounded-full bg-rose-100 px-3 py-1.5 text-sm font-semibold text-rose-700"
          >
            🆘 지금 힘들어요
          </Link>
        </header>

        <main className="flex-1 px-4 pb-28 pt-5">{children}</main>

        <nav
          aria-label="주요 메뉴"
          className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-md grid-cols-5 border-t border-slate-200 bg-white/95 backdrop-blur"
        >
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              aria-current={isActive(t.href) ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                isActive(t.href) ? "font-bold text-blue-700" : "text-slate-500"
              }`}
            >
              <span className="text-xl leading-none">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
