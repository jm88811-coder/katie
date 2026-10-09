"use client";

import { useState } from "react";
import { MCard, PageTitle, PrimaryButton } from "@/components/mind/ui";
import { newId, usePies } from "@/lib/mind/store";

const COLORS = ["#1e293b", "#2563eb", "#22b8cf", "#facc15", "#fb923c", "#a78bfa"];

interface Row {
  label: string;
  percent: number;
}

export default function PiePage() {
  const { value: pies, setValue } = usePies();
  const [claim, setClaim] = useState("");
  const [rows, setRows] = useState<Row[]>([
    { label: "", percent: 0 },
    { label: "", percent: 0 },
  ]);
  const [savedMsg, setSavedMsg] = useState(false);

  const sum = rows.reduce((s, r) => s + r.percent, 0);
  const myShare = Math.max(0, 100 - sum);
  const slices = [...rows.map((r) => ({ ...r })), { label: "나의 몫", percent: myShare }];

  let acc = 0;
  const gradient = slices
    .map((s, i) => {
      const from = acc;
      acc += s.percent;
      return `${i === slices.length - 1 ? "#ef4444" : COLORS[i % COLORS.length]} ${from}% ${acc}%`;
    })
    .join(", ");

  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  function save() {
    setValue((prev) => [
      {
        id: newId("pie"),
        claim: claim.trim(),
        factors: slices.filter((s) => s.label.trim() || s.percent > 0),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSavedMsg(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="🥧 책임 파이"
        sub="'다 내 탓이야'라는 생각, 정말 100%가 내 몫일까요? 다른 요인에 몫을 나눠 보세요."
      />

      <MCard>
        <label className="text-sm font-semibold" htmlFor="claim">
          내가 떠안고 있는 생각
        </label>
        <input
          id="claim"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="예: 내가 프로젝트를 망쳤어"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
      </MCard>

      <MCard className="flex flex-col items-center gap-3">
        <div
          role="img"
          aria-label={`나의 몫 ${myShare}%`}
          className="relative h-44 w-44 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        >
          <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="text-3xl font-extrabold text-rose-500">{myShare}%</span>
            <span className="text-xs text-slate-500">나의 몫</span>
          </div>
        </div>
      </MCard>

      <MCard className="flex flex-col gap-4">
        <p className="text-sm font-semibold">영향을 준 다른 요인과 몫</p>
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <input
                value={r.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="예: 마감 기한이 촉박했음"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <span className="w-10 text-right text-sm font-bold text-blue-700">{r.percent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={r.percent}
              aria-label={`${r.label || `요인 ${i + 1}`} 몫`}
              onChange={(e) => update(i, { percent: Math.min(Number(e.target.value), r.percent + myShare) })}
              className="w-full accent-blue-700"
            />
          </div>
        ))}
        {rows.length < COLORS.length - 1 && (
          <button
            type="button"
            onClick={() => setRows((p) => [...p, { label: "", percent: 0 }])}
            className="self-start text-sm font-medium text-blue-700 underline"
          >
            + 요인 추가
          </button>
        )}
      </MCard>

      <PrimaryButton onClick={save} disabled={!claim.trim() || sum === 0}>
        저장하기
      </PrimaryButton>
      {savedMsg && (
        <p className="text-center text-sm text-emerald-700">
          저장했어요. 내 몫이 {myShare}%라는 걸 알아차린 것만으로도 충분히 의미 있어요.
        </p>
      )}
      {pies.length > 0 && <p className="text-center text-xs text-slate-400">저장된 책임 파이 {pies.length}개</p>}
    </div>
  );
}
