"use client";

import { useState } from "react";

const field =
  "w-full rounded-lg border border-black/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-violet-500 dark:border-white/15";

// 서버 없이 동작: 입력 내용을 메일 작성 링크(mailto:)로 넘깁니다. 받는 주소는 실제 값으로 교체하세요.
export default function ConsultForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [field_, setField] = useState("");
  const [memo, setMemo] = useState("");
  const ready = name.trim() !== "" && contact.trim() !== "";

  const body = ["[상담 신청]", `성함: ${name}`, `연락처: ${contact}`, `업종: ${field_}`, memo && `고민: ${memo}`]
    .filter(Boolean)
    .join("\n");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("[SPCL] 상담 신청")}&body=${encodeURIComponent(body)}`;
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">성함 *
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">연락처 *
          <input className={field} value={contact} onChange={(e) => setContact(e.target.value)} required />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">업종
        <input className={field} placeholder="예: 세무사, 피부과 원장" value={field_} onChange={(e) => setField(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">지금 가장 큰 고민
        <textarea className={`${field} min-h-24`} value={memo} onChange={(e) => setMemo(e.target.value)} />
      </label>
      <button
        type="submit"
        disabled={!ready}
        className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40"
      >
        상담 신청 메일 작성하기
      </button>
      <p className="text-xs text-foreground/50">입력 내용은 저장되지 않고 메일 앱으로 전달됩니다.</p>
    </form>
  );
}
