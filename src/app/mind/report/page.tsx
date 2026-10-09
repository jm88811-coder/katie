"use client";

import { useMemo, useState } from "react";
import { Chip, MCard, PageTitle, PrimaryButton } from "@/components/mind/ui";
import { buildReport } from "@/lib/mind/engine";
import { useRouter } from "next/navigation";
import {
  useCheckIns,
  useMeditations,
  usePies,
  useRecords,
  useValues,
} from "@/lib/mind/store";

export default function ReportPage() {
  const router = useRouter();
  const { value: checkIns, setValue: setCheckIns } = useCheckIns();
  const { value: records, setValue: setRecords } = useRecords();
  const { value: meditations, setValue: setMeditations } = useMeditations();
  const { value: values, setValue: setValues } = useValues();
  const { value: pies, setValue: setPies } = usePies();
  const [days, setDays] = useState(14);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const report = useMemo(
    () => buildReport({ checkIns, records, meditations, values, days }),
    [checkIns, records, meditations, values, days]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can select the text manually
    }
  }

  function exportJson() {
    const blob = new Blob(
      [JSON.stringify({ checkIns, records, meditations, values, pies }, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "maeumgyeol-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function wipe() {
    setCheckIns([]);
    setRecords([]);
    setMeditations([]);
    setValues([]);
    setPies([]);
    router.push("/mind");
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="📄 상담사 리포트" sub="상담이나 진료 때 보여줄 수 있는 요약본이에요. 공유 여부는 내가 정해요." />

      <div className="flex gap-2">
        {[7, 14, 30].map((d) => (
          <Chip key={d} active={days === d} onClick={() => setDays(d)}>
            최근 {d}일
          </Chip>
        ))}
      </div>

      <MCard>
        <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-700">{report}</pre>
      </MCard>

      <PrimaryButton onClick={copy}>{copied ? "복사했어요 ✓" : "리포트 복사하기"}</PrimaryButton>

      <MCard className="flex flex-col gap-3">
        <p className="font-semibold">🔒 내 데이터 관리</p>
        <p className="text-sm text-slate-500">
          기록은 이 기기의 브라우저에만 저장돼요. 백업하거나 완전히 삭제할 수 있어요.
        </p>
        <button
          type="button"
          onClick={exportJson}
          className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium"
        >
          백업 파일(JSON) 내려받기
        </button>
        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={wipe}
              className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white"
            >
              정말 모두 삭제
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-700"
          >
            모든 기록 삭제
          </button>
        )}
      </MCard>
    </div>
  );
}
