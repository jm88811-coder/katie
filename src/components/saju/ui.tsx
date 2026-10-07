"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  BRANCHES, BRANCHES_HANJA, ELEMENTS, ELEMENTS_HANJA, ELEMENT_COLORS, STEMS, STEMS_HANJA,
  BRANCH_ELEMENT, birthToQuery, stemElement, tenGod,
  type BirthInput, type Daewoon, type Pillar, type SajuChart,
} from "@/lib/saju/core";
import { BRAND } from "@/lib/saju/content";
import { useLocalState } from "@/lib/storage";
import { dayKey, useProfiles, useStreak, useWaitlist } from "@/lib/saju/store";

// ───────── 공통 ─────────
export function SajuShell({ children }: { children: ReactNode }) {
  const { value: theme, setValue: setTheme } = useLocalState<"dark" | "light">("saju:theme", "dark");
  return (
    <div className="saju min-h-screen" data-theme={theme}>
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-3xl items-center gap-4 overflow-x-auto px-4 py-3 text-sm whitespace-nowrap">
          <Link href="/saju" className="serif mr-2 text-base font-bold text-[var(--seal)]">
            {BRAND.name}
          </Link>
          {[["/saju", "내 사주"], ["/saju/path", "인생 전략서"], ["/saju/today", "오늘의 운세"], ["/saju/year", "신년운세"], ["/saju/match", "궁합"], ["/saju/book", "상담"]].map(
            ([href, label]) => (
              <Link key={href} href={href} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
                {label}
              </Link>
            )
          )}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
            className="ml-auto shrink-0 rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--ink-soft)]"
          >
            {theme === "dark" ? "☀ 한지" : "🌙 밤"}
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-12 text-xs leading-relaxed text-[var(--ink-soft)]">
        본 서비스의 결과는 명리학에 기반한 오락·참고용입니다. 입력 정보는 이 기기에만 저장되며, “AI 풀이”를 직접 요청한 경우에만 풀이 생성을 위해 Anthropic API로 전송됩니다.
        중요한 결정은 전문가와 상의하세요.
      </footer>
    </div>
  );
}

export function H2({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-3 mt-10">
      <h2 className="serif text-xl font-bold">{children}</h2>
      {sub && <p className="mt-1 text-sm text-[var(--ink-soft)]">{sub}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function ScoreBar({ score, color = "var(--seal)" }: { score: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line)]" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
    </div>
  );
}

export function AdSlot({ label = "광고·제휴 영역" }: { label?: string }) {
  return (
    <div className="my-8 flex h-24 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-xs text-[var(--ink-soft)]" aria-label="광고 영역">
      {label} (예: 애드센스 / 제휴 배너)
    </div>
  );
}

// ───────── 입력 폼 ─────────
const field =
  "w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-sm outline-none focus:border-[var(--seal)]";

export function BirthForm({
  initial, submitLabel = "무료로 내 사주 보기", to = "/saju/result", prefix = "", onSubmit,
}: {
  initial?: Partial<BirthInput>;
  submitLabel?: string;
  to?: string;
  prefix?: string;
  onSubmit?: (b: BirthInput) => void;
}) {
  const router = useRouter();
  const { save } = useProfiles();
  const [name, setName] = useState(initial?.name ?? "");
  const [gender, setGender] = useState<"M" | "F">(initial?.gender ?? "F");
  const [calendar, setCalendar] = useState<"solar" | "lunar">(initial?.calendar ?? "solar");
  const [date, setDate] = useState(
    initial?.year ? `${initial.year}-${String(initial.month).padStart(2, "0")}-${String(initial.day).padStart(2, "0")}` : ""
  );
  const [time, setTime] = useState(initial?.hour != null ? `${String(initial.hour).padStart(2, "0")}:${String(initial.minute ?? 0).padStart(2, "0")}` : "");
  const [unknownTime, setUnknownTime] = useState(initial ? initial.hour === null : false);
  const [leap, setLeap] = useState(initial?.leap ?? false);
  const [trueSolar, setTrueSolar] = useState(initial?.trueSolar ?? false);
  const [err, setErr] = useState("");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const [y, m, d] = date.split("-").map(Number);
        if (!y || !m || !d || y < 1900 || y > 2100) return setErr("생년월일을 확인해 주세요 (1900~2100년).");
        let hour: number | null = null, minute = 0;
        if (!unknownTime) {
          if (!time) return setErr("태어난 시간을 입력하거나 '시간 모름'을 선택해 주세요.");
          [hour, minute] = time.split(":").map(Number);
        }
        const b: BirthInput = { year: y, month: m, day: d, hour, minute, gender, calendar, leap: calendar === "lunar" && leap, trueSolar, name: name.trim() };
        setErr("");
        if (onSubmit) return onSubmit(b);
        save(b);
        router.push(`${to}?${birthToQuery(b)}`);
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        이름(선택)
        <input className={field} value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="예: 지은" />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <fieldset className="flex flex-col gap-1 text-sm">
          <legend className="mb-1">성별</legend>
          <div className="flex gap-2">
            {([["F", "여성"], ["M", "남성"]] as const).map(([v, l]) => (
              <button key={v} type="button" onClick={() => setGender(v)} aria-pressed={gender === v}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${gender === v ? "border-[var(--seal)] bg-[var(--seal)] text-[var(--on-seal)]" : "border-[var(--line)]"}`}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-1 text-sm">
          <legend className="mb-1">달력</legend>
          <div className="flex gap-2">
            {([["solar", "양력"], ["lunar", "음력"]] as const).map(([v, l]) => (
              <button key={v} type="button" onClick={() => setCalendar(v)} aria-pressed={calendar === v}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${calendar === v ? "border-[var(--seal)] bg-[var(--seal)] text-[var(--on-seal)]" : "border-[var(--line)]"}`}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          생년월일 *
          <input className={field} type="date" min="1900-01-01" max="2100-12-31" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          태어난 시간
          <input className={field} type="time" value={time} disabled={unknownTime} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--ink-soft)]">
        <label className="flex items-center gap-2"><input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} /> 시간 모름</label>
        {calendar === "lunar" && (
          <label className="flex items-center gap-2"><input type="checkbox" checked={leap} onChange={(e) => setLeap(e.target.checked)} /> 윤달</label>
        )}
        <label className="flex items-center gap-2"><input type="checkbox" checked={trueSolar} onChange={(e) => setTrueSolar(e.target.checked)} /> 진태양시 보정(−30분)</label>
      </div>

      {err && <p role="alert" className="text-sm text-[var(--seal)]">{err}</p>}
      <button type="submit" className="rounded-xl bg-[var(--seal)] px-5 py-3.5 text-base font-semibold text-[var(--on-seal)] hover:opacity-90">
        {submitLabel}
      </button>
      <p className="text-xs text-[var(--ink-soft)]">가입·결제 없음 · 입력값은 이 기기에서만 계산됩니다{prefix ? "" : ""}.</p>
    </form>
  );
}

export function SavedProfiles({ to = "/saju/result" }: { to?: string }) {
  const { profiles, remove, hydrated } = useProfiles();
  if (!hydrated || profiles.length === 0) return null;
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-semibold">저장된 사주</p>
      <ul className="flex flex-wrap gap-2">
        {profiles.map((p, i) => (
          <li key={i} className="flex items-center rounded-full border border-[var(--line)] text-sm">
            <Link className="px-3 py-1.5" href={`${to}?${birthToQuery(p)}`}>
              {p.name || "이름 없음"} · {p.year}.{p.month}.{p.day}
            </Link>
            <button aria-label="삭제" className="pr-3 text-[var(--ink-soft)]" onClick={() => remove(i)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ───────── 사주 표 ─────────
function Cell({ p, dm, hidden, label }: { p: Pillar | null; dm: number; hidden?: boolean; label: string }) {
  if (!p || hidden) {
    return (
      <div className="flex flex-col items-center gap-1 py-3 text-[var(--ink-soft)]">
        <span className="text-xs">{label}</span>
        <span className="serif text-3xl">?</span>
        <span className="text-xs">시간 모름</span>
      </div>
    );
  }
  const se = stemElement(p.stem), be = BRANCH_ELEMENT[p.branch];
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <span className="text-xs text-[var(--ink-soft)]">{label}</span>
      <span className="text-[11px] text-[var(--ink-soft)]">{label === "일주" ? "일간(나)" : tenGod(dm, p.stem)}</span>
      <span className="serif flex h-14 w-14 items-center justify-center rounded-lg text-3xl font-bold text-white" style={{ background: ELEMENT_COLORS[se] }}>
        {STEMS_HANJA[p.stem]}
      </span>
      <span className="serif flex h-14 w-14 items-center justify-center rounded-lg text-3xl font-bold text-white" style={{ background: ELEMENT_COLORS[be] }}>
        {BRANCHES_HANJA[p.branch]}
      </span>
      <span className="text-xs">{STEMS[p.stem]}{BRANCHES[p.branch]} · {ELEMENTS[se]}/{ELEMENTS[be]}</span>
    </div>
  );
}

export function PillarsTable({ chart }: { chart: SajuChart }) {
  const dm = chart.day.stem;
  return (
    <Card className="!p-2">
      <div className="grid grid-cols-4 divide-x divide-[var(--line)]">
        <Cell p={chart.hour} dm={dm} label="시주" />
        <Cell p={chart.day} dm={dm} label="일주" />
        <Cell p={chart.month} dm={dm} label="월주" />
        <Cell p={chart.year} dm={dm} label="연주" />
      </div>
    </Card>
  );
}

export function ElementChart({ counts }: { counts: number[] }) {
  const max = Math.max(...counts, 1);
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return (
    <Card>
      <ul className="flex flex-col gap-2.5">
        {counts.map((c, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="w-14 shrink-0 font-semibold">{ELEMENTS[i]}({ELEMENTS_HANJA[i]})</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
              <div className="h-full rounded-full" style={{ width: `${(c / max) * 100}%`, background: ELEMENT_COLORS[i] }} />
            </div>
            <span className="w-16 shrink-0 text-right text-[var(--ink-soft)]">{c} · {Math.round((c / total) * 100)}%</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--ink-soft)]">월지는 월령(계절의 힘)으로 2배 가중, 지장간은 본기만 반영합니다.</p>
    </Card>
  );
}

export function DaewoonTimeline({ list, currentAge }: { list: Daewoon[]; currentAge: number }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2">
      <ol className="flex gap-2">
        {list.map((d) => {
          const now = currentAge >= d.startAge && currentAge <= d.endAge;
          return (
            <li key={d.startAge} className={`card w-24 shrink-0 p-3 text-center ${now ? "!border-[var(--seal)] ring-1 ring-[var(--seal)]" : ""}`}>
              <div className="text-xs text-[var(--ink-soft)]">{d.startAge}~{d.endAge}세</div>
              <div className="serif my-1 text-2xl font-bold">{STEMS_HANJA[d.pillar.stem]}{BRANCHES_HANJA[d.pillar.branch]}</div>
              <div className="text-xs">{STEMS[d.pillar.stem]}{BRANCHES[d.pillar.branch]}</div>
              <div className="mt-1 text-xs font-semibold text-[var(--seal)]">{d.god}</div>
              {now && <div className="mt-1 text-[10px] text-[var(--seal)]">현재 대운</div>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ───────── 재방문·잠금 ─────────
export function StreakBadge({ record = false }: { record?: boolean }) {
  const { streak, hydrated } = useStreak(record);
  if (!hydrated) return null;
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 text-sm">
      <span aria-hidden>🔥</span>
      <span>연속 방문 <b>{streak}</b>일</span>
      <span className="text-xs text-[var(--ink-soft)]">3일 재물 · 7일 연애 · 14일 직업 심층 해제</span>
    </div>
  );
}

export function LockedReport({ id, title, body, unlockStreak }: { id: string; title: string; body: string; unlockStreak: number }) {
  const { streak } = useStreak(false);
  const { joined, join } = useWaitlist();
  const open = streak >= unlockStreak;
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="serif text-lg font-bold">{title}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${open ? "bg-[#2f8f5b] text-white" : "border border-[var(--line)] text-[var(--ink-soft)]"}`}>
          {open ? "무료 해제됨" : `🔒 ${unlockStreak}일 연속 방문 시 무료`}
        </span>
      </div>
      <p className={`text-sm leading-relaxed ${open ? "" : "select-none blur-sm"}`} aria-hidden={!open}>
        {open ? body : body.replace(/[^\s]/g, "●")}
      </p>
      {!open && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[var(--ink-soft)]">현재 {streak}일째 · 매일 오늘의 운세를 열면 열립니다.</span>
          <Link href="/saju/today" className="rounded-lg bg-[var(--seal)] px-3 py-1.5 text-[var(--on-seal)]">오늘의 운세 열기</Link>
          <button onClick={() => join(id)} disabled={joined.includes(id)} className="rounded-lg border border-[var(--line)] px-3 py-1.5 disabled:opacity-60">
            {joined.includes(id) ? "전문가 풀리포트 대기 신청됨" : "전문가 풀리포트 알림 신청"}
          </button>
        </div>
      )}
    </Card>
  );
}

export function ShareButton({ label = "내 결과 링크 복사" }: { label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
      onClick={async () => {
        try {
          const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
          if (nav.share) await nav.share({ title: BRAND.name, url: location.href });
          else await navigator.clipboard.writeText(location.href);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {}
      }}
    >
      {done ? "복사됨 ✓" : label}
    </button>
  );
}

export { dayKey };
export type { SajuChart };
