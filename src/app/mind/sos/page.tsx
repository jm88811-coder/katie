"use client";

import { useEffect, useState } from "react";
import { CrisisBanner, MCard, PageTitle, PrimaryButton } from "@/components/mind/ui";

const PATTERN = [
  { label: "들이쉬기", sec: 4, scale: 1.25 },
  { label: "멈추기", sec: 4, scale: 1.25 },
  { label: "내쉬기", sec: 6, scale: 0.8 },
] as const;

const GROUNDING = [
  "눈에 보이는 것 5가지",
  "손으로 만져지는 것 4가지",
  "들리는 소리 3가지",
  "맡을 수 있는 냄새 2가지",
  "입안에서 느껴지는 맛 1가지",
];

export default function SosPage() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState<number>(PATTERN[0].sec);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1;
        setPhase((p) => {
          const next = (p + 1) % PATTERN.length;
          if (next === 0) setCycles((c) => c + 1);
          setLeft(PATTERN[next].sec);
          return next;
        });
        return l;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const cur = PATTERN[phase];

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="🆘 지금 힘들어요" sub="먼저 몸을 가라앉혀요. 생각은 그다음이에요." />

      <MCard className="flex flex-col items-center gap-4 bg-sky-50">
        <div
          aria-hidden
          className="flex h-40 w-40 items-center justify-center rounded-full bg-sky-300/60 text-lg font-bold text-sky-900 transition-transform ease-in-out"
          style={{
            transform: running ? `scale(${cur.scale})` : "scale(1)",
            transitionDuration: `${cur.sec}s`,
          }}
        >
          {running ? `${cur.label} ${left}` : "준비"}
        </div>
        <p className="text-sm text-slate-600" aria-live="polite">
          {running ? `${cycles}회 완료 · 4초 들이쉬고 4초 멈추고 6초 내쉬어요` : "원이 커질 때 들이쉬고, 작아질 때 내쉬어요."}
        </p>
        <div className="w-full">
          <PrimaryButton
            onClick={() => {
              setRunning(!running);
              setPhase(0);
              setLeft(PATTERN[0].sec);
              setCycles(0);
            }}
          >
            {running ? "멈추기" : "호흡 시작"}
          </PrimaryButton>
        </div>
      </MCard>

      <MCard>
        <p className="font-semibold">🌍 5-4-3-2-1 지금 여기로 돌아오기</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {GROUNDING.map((g, i) => (
            <li key={g} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                {5 - i}
              </span>
              {g}
            </li>
          ))}
        </ul>
      </MCard>

      <p className="px-1 text-sm font-semibold text-slate-600">전문 상담이 필요하다면</p>
      <CrisisBanner />
    </div>
  );
}
