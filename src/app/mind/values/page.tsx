"use client";

import { useMemo, useState } from "react";
import { Chip, MCard, PageTitle, PrimaryButton, Slider } from "@/components/mind/ui";
import { VALUE_AREAS, VALUE_SUGGESTIONS } from "@/lib/mind/data";
import { weekKey } from "@/lib/mind/engine";
import { newId, useValues } from "@/lib/mind/store";
import { useHydrated } from "@/lib/storage";

export default function ValuesPage() {
  const hydrated = useHydrated();
  const { value: values, setValue } = useValues();
  const [areaId, setAreaId] = useState(VALUE_AREAS[0].id);
  const [text, setText] = useState("");
  const [goal, setGoal] = useState(3);
  const [importance, setImportance] = useState(7);
  const week = weekKey();

  const current = useMemo(() => values.filter((v) => v.weekKey === week), [values, week]);
  const area = VALUE_AREAS.find((a) => a.id === areaId)!;

  /** 영역별 주간 달성률(0-1) → 나침반 반경. */
  const compass = VALUE_AREAS.map((a) => {
    const items = current.filter((v) => v.areaId === a.id);
    const goalSum = items.reduce((s, v) => s + v.goal, 0);
    const doneSum = items.reduce((s, v) => s + Math.min(v.done, v.goal), 0);
    return { ...a, ratio: goalSum ? doneSum / goalSum : 0, has: items.length > 0 };
  });

  function add() {
    if (!text.trim()) return;
    setValue((prev) => [
      ...prev,
      { id: newId("val"), areaId, text: text.trim(), done: 0, goal, importance, weekKey: week },
    ]);
    setText("");
  }

  const bump = (id: string, delta: number) =>
    setValue((prev) =>
      prev.map((v) => (v.id === id ? { ...v, done: Math.max(0, Math.min(v.goal + 3, v.done + delta)) } : v))
    );
  const remove = (id: string) => setValue((prev) => prev.filter((v) => v.id !== id));

  /** 이전 주에 세운 가치를 이번 주로 이어오기 */
  function carryOver() {
    const latest = [...new Set(values.map((v) => v.weekKey))].filter((w) => w !== week).sort().pop();
    if (!latest) return;
    setValue((prev) => [
      ...prev,
      ...prev
        .filter((v) => v.weekKey === latest)
        .map((v) => ({ ...v, id: newId("val"), done: 0, weekKey: week })),
    ]);
  }

  const R = 88;
  const C = 110;
  const pointOf = (i: number, r: number) => {
    const ang = (Math.PI * 2 * i) / compass.length - Math.PI / 2;
    return [C + r * Math.cos(ang), C + r * Math.sin(ang)] as const;
  };
  const polygon = compass.map((a, i) => pointOf(i, 8 + a.ratio * (R - 8)).join(",")).join(" ");

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="🧭 가치 나침반" sub="생각이 흔들려도 내가 향하고 싶은 방향은 그대로예요." />

      <MCard>
        <svg viewBox="0 0 220 220" role="img" aria-label="영역별 가치 행동 달성률" className="mx-auto w-full max-w-xs">
          {[0.33, 0.66, 1].map((k) => (
            <circle key={k} cx={C} cy={C} r={R * k} fill="#eff6ff" stroke="#bfdbfe" strokeWidth={1} opacity={0.7} />
          ))}
          <polygon points={polygon} fill="#1d4ed8" fillOpacity={0.35} stroke="#1d4ed8" strokeWidth={2} />
          {compass.map((a, i) => {
            const [x, y] = pointOf(i, R + 14);
            return (
              <text
                key={a.id}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8.5}
                fontWeight={a.has ? 700 : 400}
                fill={a.has ? "#0f172a" : "#94a3b8"}
              >
                {a.label}
              </text>
            );
          })}
        </svg>
        <p className="mt-2 text-center text-xs text-slate-500">이번 주 영역별 가치 행동 달성률</p>
      </MCard>

      <MCard className="flex flex-col gap-4">
        <p className="font-semibold">가치와 행동 추가</p>
        <div className="flex flex-wrap gap-2">
          {VALUE_AREAS.map((a) => (
            <Chip key={a.id} active={a.id === areaId} onClick={() => setAreaId(a.id)}>
              {a.emoji} {a.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {VALUE_SUGGESTIONS[areaId].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-800"
            >
              + {s}
            </button>
          ))}
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`${area.label}에서 소중히 여기는 행동`}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
        <Slider label="주간 목표 횟수" value={goal} onChange={(n) => setGoal(Math.max(1, n))} lowLabel="1" highLabel="10" />
        <Slider label="나에게 얼마나 중요한가" value={importance} onChange={setImportance} />
        <PrimaryButton onClick={add} disabled={!text.trim()}>
          추가하기
        </PrimaryButton>
      </MCard>

      <MCard>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold">이번 주 가치 행동</p>
          {hydrated && !current.length && values.length > 0 && (
            <button type="button" onClick={carryOver} className="text-xs font-medium text-blue-700 underline">
              지난주 가치 이어오기
            </button>
          )}
        </div>
        {!current.length && <p className="text-sm text-slate-400">아직 추가한 가치 행동이 없어요.</p>}
        <ul className="divide-y divide-slate-100">
          {current.map((v) => {
            const a = VALUE_AREAS.find((x) => x.id === v.areaId);
            return (
              <li key={v.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{v.text}</p>
                  <p className="text-xs text-slate-400">
                    {a?.emoji} {a?.label} · 중요도 {v.importance}/10
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="한 번 줄이기"
                    onClick={() => bump(v.id, -1)}
                    className="h-8 w-8 rounded-full border border-slate-200 text-slate-600"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-blue-700">
                    {v.done}/{v.goal}
                  </span>
                  <button
                    type="button"
                    aria-label="실천 1회 추가"
                    onClick={() => bump(v.id, 1)}
                    className="h-8 w-8 rounded-full bg-blue-700 text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() => remove(v.id)}
                  className="text-xs text-slate-300 hover:text-rose-500"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      </MCard>
    </div>
  );
}
