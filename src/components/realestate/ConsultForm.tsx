"use client";

import { useEffect, useState } from "react";
import { PROPERTY_TYPES } from "@/lib/data/realestate";

const TYPES = [...PROPERTY_TYPES, "기타"];
const PURPOSES = ["매수", "매도(매물 내놓기)", "전세", "월세", "대출 상담", "양도세 상담"];

// 매물 카테고리 카드를 누르면 이 이벤트로 상담서의 매물 종류가 채워집니다.
export const CONSULT_TYPE_EVENT = "consult:type";

const field =
  "w-full rounded-lg border border-black/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-red-500 dark:border-white/15";

// 서버 없이 동작하도록, 입력한 내용으로 사무소에 보낼 문자(SMS) 링크를 만듭니다.
export default function ConsultForm({ mobile }: { mobile: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState<string>(TYPES[0]);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [budget, setBudget] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const onType = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;
      if (TYPES.includes(next)) setType(next);
    };
    window.addEventListener(CONSULT_TYPE_EVENT, onType);
    return () => window.removeEventListener(CONSULT_TYPE_EVENT, onType);
  }, []);

  const body = [
    "[상담 요청]",
    `성함: ${name}`,
    `연락처: ${contact}`,
    `매물: ${type} / ${purpose}`,
    budget && `예산: ${budget}`,
    memo && `요청사항: ${memo}`,
  ]
    .filter(Boolean)
    .join("\n");

  const ready = name.trim() !== "" && contact.trim() !== "";

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        window.location.href = `sms:${mobile}?body=${encodeURIComponent(body)}`;
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          성함 *
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          연락처 *
          <input
            className={field}
            type="tel"
            inputMode="tel"
            placeholder="010-0000-0000"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          매물 종류
          <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          상담 유형
          <select className={field} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            {PURPOSES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        예산
        <input className={field} placeholder="예: 전세 3억 이내" value={budget} onChange={(e) => setBudget(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        요청사항
        <textarea
          className={`${field} min-h-24`}
          placeholder="희망 단지·평형, 입주 시기, 꼭 필요한 조건 등"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </label>
      <button
        type="submit"
        disabled={!ready}
        className="mt-1 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40"
      >
        문자로 상담 요청 보내기
      </button>
      <p className="text-xs text-foreground/50">입력하신 정보는 저장되지 않고, 문자 앱으로 바로 전달됩니다.</p>
    </form>
  );
}
