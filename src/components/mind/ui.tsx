"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { HOTLINES } from "@/lib/mind/data";

export function MCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-5">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </header>
  );
}

export function Slider({
  label,
  value,
  onChange,
  lowLabel = "낮음",
  highLabel = "높음",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-lg font-bold text-blue-700">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-700"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </label>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
      }`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-blue-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {children}
    </button>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
    />
  );
}

/** 위기 신호 감지 시 표시되는 안전망 배너. */
export function CrisisBanner() {
  return (
    <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-5">
      <p className="font-semibold text-rose-900">지금 많이 힘드신 것 같아요. 혼자 견디지 않으셔도 돼요.</p>
      <p className="mt-1 text-sm text-rose-800">
        아래 번호로 지금 바로 전문 상담사와 이야기할 수 있어요. 모두 24시간 무료예요.
      </p>
      <ul className="mt-3 space-y-2">
        {HOTLINES.map((h) => (
          <li key={h.number}>
            <a
              href={`tel:${h.number.replace(/-/g, "")}`}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm"
            >
              <span>
                <span className="font-medium text-slate-900">{h.name}</span>
                <span className="block text-xs text-slate-500">{h.note}</span>
              </span>
              <span className="text-lg font-bold text-rose-700">{h.number}</span>
            </a>
          </li>
        ))}
      </ul>
      <Link href="/mind/sos" className="mt-3 inline-block text-sm font-medium text-rose-800 underline">
        우선 호흡으로 몸부터 진정하기
      </Link>
    </div>
  );
}

/** 간단 SVG 라인차트 (0-10 값). */
export function LineChart({ points, label }: { points: { x: string; y: number }[]; label: string }) {
  if (points.length < 2) {
    return <p className="py-6 text-center text-sm text-slate-400">기록이 2개 이상 쌓이면 추이가 보여요.</p>;
  }
  const W = 300;
  const H = 110;
  const pad = 14;
  const step = (W - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => ({
    cx: pad + i * step,
    cy: H - pad - (p.y / 10) * (H - pad * 2),
    ...p,
  }));
  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} role="img" aria-label={label} className="w-full">
      {[0, 5, 10].map((v) => {
        const y = H - pad - (v / 10) * (H - pad * 2);
        return <line key={v} x1={pad} x2={W - pad} y1={y} y2={y} stroke="#e2e8f0" strokeWidth={1} />;
      })}
      <polyline
        fill="none"
        stroke="#1e293b"
        strokeWidth={2}
        points={coords.map((c) => `${c.cx},${c.cy}`).join(" ")}
      />
      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r={3.5} fill="#1d4ed8" />
          <text x={c.cx} y={H + 12} textAnchor="middle" fontSize={9} fill="#94a3b8">
            {c.x}
          </text>
        </g>
      ))}
    </svg>
  );
}
