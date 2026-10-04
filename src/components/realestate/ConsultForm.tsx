"use client";

import { useState } from "react";

const PURPOSES = [
  "매매(구입)",
  "매매(매도)",
  "전세",
  "월세",
  "분양권",
  "상가·토지·주택·공장",
  "매물 내놓기",
  "대출 상담",
  "양도세 상담",
];

const field =
  "w-full rounded-lg border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-red-500 dark:border-white/15";

// 서버 없이 동작하도록, 입력한 내용으로 사무소에 보낼 문자(SMS) 링크를 만듭니다.
export default function ConsultForm({ mobile }: { mobile: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [budget, setBudget] = useState("");
  const [memo, setMemo] = useState("");

  const body = [
    "[상담 요청]",
    `성함: ${name}`,
    `연락처: ${contact}`,
    `희망: ${purpose}`,
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
      <label className="flex flex-col gap-1 text-sm">
        상담 유형
        <select className={field} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          {PURPOSES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        예산
        <input className={field} placeholder="예: 전세 3억 이내" value={budget} onChange={(e) => setBudget(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        요청사항
        <textarea
          className={`${field} min-h-24`}
          placeholder="희망 지역, 입주 시기, 꼭 필요한 조건 등"
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
      <p className="text-xs text-foreground/50">입력하신 정보는 상담 목적으로만 사용됩니다.</p>
    </form>
  );
}
