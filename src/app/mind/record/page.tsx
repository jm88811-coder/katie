"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Chip,
  CrisisBanner,
  MCard,
  PageTitle,
  PrimaryButton,
  Slider,
  TextArea,
} from "@/components/mind/ui";
import { DISTORTIONS, EMOTIONS } from "@/lib/mind/data";
import { detectCrisis, detectDistortions } from "@/lib/mind/engine";
import { newId, useRecords } from "@/lib/mind/store";

const STEPS = ["상황", "생각", "감정", "거리두기", "대안"] as const;

export default function RecordPage() {
  const { value: records, setValue } = useRecords();
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [emotions, setEmotions] = useState<string[]>([]);
  const [before, setBefore] = useState(6);
  const [picked, setPicked] = useState<string[] | null>(null);
  const [evidence, setEvidence] = useState("");
  const [reframe, setReframe] = useState("");
  const [after, setAfter] = useState(4);
  const [saved, setSaved] = useState(false);

  const suggested = useMemo(() => detectDistortions(thought), [thought]);
  const distortionIds = picked ?? suggested;
  const crisis = detectCrisis(situation, thought, evidence, reframe);
  const activeDistortions = DISTORTIONS.filter((d) => distortionIds.includes(d.id));

  const toggleEmotion = (e: string) =>
    setEmotions((p) => (p.includes(e) ? p.filter((x) => x !== e) : [...p, e]));
  const toggleDistortion = (id: string) =>
    setPicked((prev) => {
      const cur = prev ?? suggested;
      return cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    });

  const canNext = [
    situation.trim().length > 0,
    thought.trim().length > 0,
    emotions.length > 0,
    true,
    reframe.trim().length > 0,
  ][step];

  function save() {
    setValue((prev) => [
      {
        id: newId("tr"),
        situation: situation.trim(),
        thought: thought.trim(),
        emotions,
        intensityBefore: before,
        distortionIds,
        evidenceAgainst: evidence.trim(),
        reframe: reframe.trim(),
        intensityAfter: after,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSaved(true);
  }

  function reset() {
    setStep(0);
    setSituation("");
    setThought("");
    setEmotions([]);
    setBefore(6);
    setPicked(null);
    setEvidence("");
    setReframe("");
    setAfter(4);
    setSaved(false);
  }

  if (saved) {
    const diff = before - after;
    return (
      <div className="flex flex-col gap-4">
        <PageTitle title="📝 기록 완료" />
        <MCard className="text-center">
          <p className="text-4xl">{diff > 0 ? "🌱" : "🫶"}</p>
          <p className="mt-3 font-semibold">
            {diff > 0
              ? `감정 강도가 ${before} → ${after}로 ${diff}점 낮아졌어요.`
              : "생각을 글로 꺼내 보는 것만으로도 큰 한 걸음이에요."}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            강도가 그대로여도 괜찮아요. 거리두기는 연습할수록 쉬워져요.
          </p>
        </MCard>
        <PrimaryButton onClick={reset}>새 기록 쓰기</PrimaryButton>
        <Link href="/mind/progress" className="text-center text-sm font-medium text-blue-700 underline">
          나의 변화 보기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="📝 생각기록지" sub="떠오른 생각을 적고, 한 발 떨어져 바라봐요." />

      <ol className="flex items-center justify-between px-1" aria-label="진행 단계">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center gap-1 text-[11px]">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1}
            </span>
            <span className={i === step ? "font-bold text-blue-700" : "text-slate-400"}>{s}</span>
          </li>
        ))}
      </ol>

      {crisis && <CrisisBanner />}

      {step === 0 && (
        <MCard>
          <p className="mb-2 text-sm font-semibold">[상황] 어떤 일이 있었나요?</p>
          <TextArea value={situation} onChange={setSituation} placeholder="예: 내일 팀 발표를 준비하는 중" />
        </MCard>
      )}

      {step === 1 && (
        <MCard>
          <p className="mb-2 text-sm font-semibold">[생각] 그 순간 머릿속에 든 생각은?</p>
          <TextArea
            value={thought}
            onChange={(v) => {
              setThought(v);
              setPicked(null);
            }}
            placeholder="예: 발표 망치면 다들 내가 능력 없다고 생각하겠지"
          />
        </MCard>
      )}

      {step === 2 && (
        <MCard className="flex flex-col gap-5">
          <div>
            <p className="mb-3 text-sm font-semibold">[감정] 그때 어떤 감정이 있었나요?</p>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((e) => (
                <Chip key={e} active={emotions.includes(e)} onClick={() => toggleEmotion(e)}>
                  {e}
                </Chip>
              ))}
            </div>
          </div>
          <Slider label="감정의 강도" value={before} onChange={setBefore} lowLabel="약함" highLabel="매우 강함" />
        </MCard>
      )}

      {step === 3 && (
        <>
          <MCard>
            <p className="text-sm font-semibold">🔍 이 생각에서 발견한 생각 습관</p>
            <p className="mb-3 mt-1 text-xs text-slate-500">
              {suggested.length
                ? "마음결이 문장에서 찾은 후보예요. 맞지 않으면 해제하고 직접 골라 보세요."
                : "자동으로 찾은 패턴이 없어요. 해당되는 것이 있으면 직접 골라 보세요."}
            </p>
            <div className="flex flex-wrap gap-2">
              {DISTORTIONS.map((d) => (
                <Chip key={d.id} active={distortionIds.includes(d.id)} onClick={() => toggleDistortion(d.id)}>
                  {d.name}
                </Chip>
              ))}
            </div>
          </MCard>

          {activeDistortions.map((d) => (
            <MCard key={d.id} className="bg-blue-50">
              <p className="font-semibold text-blue-900">{d.name}</p>
              <p className="mt-1 text-sm text-slate-600">{d.summary}</p>
              <p className="mt-2 text-sm font-medium text-blue-800">💭 {d.question}</p>
              {d.id === "personalization" && (
                <Link href="/mind/pie" className="mt-2 inline-block text-sm font-semibold text-blue-700 underline">
                  책임 파이로 나눠 보기 →
                </Link>
              )}
            </MCard>
          ))}

          <MCard>
            <p className="mb-2 text-sm font-semibold">[근거 부족] 이 생각과 맞지 않는 사실이 있다면?</p>
            <TextArea value={evidence} onChange={setEvidence} placeholder="예: 지난 발표에서도 무사히 마쳤다" />
          </MCard>
        </>
      )}

      {step === 4 && (
        <MCard className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold">[반추] 친한 친구가 같은 생각을 한다면 뭐라고 해 줄까요?</p>
            <TextArea value={reframe} onChange={setReframe} placeholder="예: 완벽하지 않아도 전달만 되면 충분해" />
          </div>
          <Slider label="지금 감정의 강도" value={after} onChange={setAfter} lowLabel="약함" highLabel="매우 강함" />
        </MCard>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700"
          >
            이전
          </button>
        )}
        <div className="flex-1">
          {step < STEPS.length - 1 ? (
            <PrimaryButton onClick={() => setStep(step + 1)} disabled={!canNext}>
              다음
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={save} disabled={!canNext}>
              기록 저장
            </PrimaryButton>
          )}
        </div>
      </div>

      {records.length > 0 && (
        <p className="text-center text-xs text-slate-400">지금까지 {records.length}개의 생각을 기록했어요.</p>
      )}
    </div>
  );
}
