"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/journey", label: "여정" },
  { href: "/inspiration", label: "영감 노트" },
  { href: "/consult", label: "고민상담" },
  { href: "/tax-legal", label: "세금·법률" },
  { href: "/study", label: "스터디" },
  { href: "/ai-jobs", label: "AI 신직업" },
  { href: "/about", label: "소개" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
          파운더스토리
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-foreground/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
