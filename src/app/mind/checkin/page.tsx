"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chip, MCard, PageTitle, PrimaryButton, Slider, TextArea } from "@/components/mind/ui";
import { BODY_PARTS, MOODS } from "@/lib/mind/data";
import { newId, useCheckIns } from "@/lib/mind/store";
import type { MoodKey } from "@/lib/mind/types";

export default function CheckInPage() {
  const router = useRouter();
  const { setValue } = useCheckIns();
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [depression, setDepression] = useState(3);
  const [anxiety, setAnxiety] = useState(3);
  const [body, setBody] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggleBody = (p: string) =>
    setBody((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  function save() {
    if (!mood) return;
    setValue((prev) => [
      {
        id: newId("ci"),
        mood,
        depression,
        anxiety,
        bodyParts: body,
        note: note.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    router.push("/mind");
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="🌤️ 마음 날씨 체크인" sub="좋고 나쁨을 판단하지 않고, 지금 상태만 알아차려요." />

      <MCard>
        <p className="mb-3 text-sm font-semibold">지금 마음 날씨는?</p>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMood(m.key)}
              aria-pressed={mood === m.key}
              className={`flex flex-col items-center gap-1 rounded-2xl border py-3 text-xs ${
                mood === m.key ? "border-blue-700 bg-blue-50 font-bold text-blue-800" : "border-slate-200"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </MCard>

      <MCard className="flex flex-col gap-5">
        <Slider label="우울·가라앉음" value={depression} onChange={setDepression} lowLabel="미미" highLabel="매우 심함" />
        <Slider label="불안·긴장" value={anxiety} onChange={setAnxiety} lowLabel="미미" highLabel="매우 심함" />
      </MCard>

      <MCard>
        <p className="mb-1 text-sm font-semibold">몸에서 느껴지는 곳이 있나요?</p>
        <p className="mb-3 text-xs text-slate-500">마음은 몸으로도 나타나요. 해당되는 곳을 골라 보세요.</p>
        <div className="flex flex-wrap gap-2">
          {BODY_PARTS.map((p) => (
            <Chip key={p} active={body.includes(p)} onClick={() => toggleBody(p)}>
              {p}
            </Chip>
          ))}
        </div>
      </MCard>

      <MCard>
        <p className="mb-2 text-sm font-semibold">한 줄 메모 (선택)</p>
        <TextArea value={note} onChange={setNote} rows={2} placeholder="오늘 하루는 어땠나요?" />
      </MCard>

      <PrimaryButton onClick={save} disabled={!mood}>
        체크인 저장
      </PrimaryButton>
    </div>
  );
}
