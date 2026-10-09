"use client";

import { useEffect, useRef, useState } from "react";
import { MCard, PageTitle, PrimaryButton } from "@/components/mind/ui";
import { MEDITATIONS } from "@/lib/mind/data";
import { newId, useMeditations } from "@/lib/mind/store";

export default function MeditatePage() {
  const { value: logs, setValue } = useMeditations();
  const [programId, setProgramId] = useState(MEDITATIONS[0].id);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const savedRef = useRef(false);

  const program = MEDITATIONS.find((m) => m.id === programId)!;
  const total = program.minutes * 60;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const finished = running && elapsed >= total;
  useEffect(() => {
    if (!finished || savedRef.current) return;
    savedRef.current = true;
    setRunning(false);
    setDone(true);
    setValue((prev) => [
      { id: newId("med"), programId, seconds: total, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, [finished, programId, total, setValue]);

  const line = [...program.script].reverse().find((s) => s.at <= elapsed)?.text ?? program.script[0].text;
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  function start() {
    savedRef.current = false;
    setElapsed(0);
    setDone(false);
    setRunning(true);
  }
  function stop() {
    setRunning(false);
    setElapsed(0);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="🍃 명상 훈련" sub="생각과 감정을 있는 그대로 지켜보는 연습이에요." />

      {!running && (
        <div className="flex flex-col gap-3">
          {MEDITATIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setProgramId(m.id);
                setDone(false);
              }}
              aria-pressed={programId === m.id}
              className={`rounded-3xl border-2 bg-gradient-to-br p-4 text-left ${m.gradient} ${
                programId === m.id ? "border-blue-700" : "border-transparent"
              }`}
            >
              <p className="text-lg font-bold">
                {m.emoji} {m.title}
              </p>
              <p className="mt-1 text-sm text-slate-700">{m.description}</p>
              <p className="mt-2 text-xs text-slate-500">{m.minutes}분</p>
            </button>
          ))}
        </div>
      )}

      {running && (
        <MCard className={`bg-gradient-to-br ${program.gradient} text-center`}>
          <p className="text-5xl" aria-hidden>
            {program.emoji}
          </p>
          <p className="mt-4 min-h-[3.5rem] text-base font-medium leading-relaxed" aria-live="polite">
            {line}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/60">
            <div className="h-full bg-blue-700 transition-all" style={{ width: `${(elapsed / total) * 100}%` }} />
          </div>
          <p className="mt-2 flex justify-between text-xs text-slate-600">
            <span>{mmss(elapsed)}</span>
            <span>-{mmss(Math.max(0, total - elapsed))}</span>
          </p>
        </MCard>
      )}

      {done && !running && (
        <MCard className="text-center">
          <p className="text-3xl">🌿</p>
          <p className="mt-2 font-semibold">훈련을 마쳤어요. 수고했어요!</p>
        </MCard>
      )}

      {running ? (
        <PrimaryButton onClick={stop}>중단하기</PrimaryButton>
      ) : (
        <PrimaryButton onClick={start}>{program.title} 시작</PrimaryButton>
      )}

      <p className="text-center text-xs text-slate-400">
        누적 {logs.length}회 · 총 {Math.round(logs.reduce((s, l) => s + l.seconds, 0) / 60)}분
      </p>
    </div>
  );
}
