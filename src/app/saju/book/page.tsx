"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, H2 } from "@/components/saju/ui";
import { BRAND } from "@/lib/saju/content";

const field = "w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-sm outline-none focus:border-[var(--seal)]";
const TOPICS = ["종합 사주", "연애·궁합", "재물·사업", "직업·진로", "작명", "소품", "상담"];

function Inner() {
  const q = useSearchParams();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState(TOPICS.includes(q.get("topic") ?? "") ? q.get("topic")! : TOPICS[0]);
  const [memo, setMemo] = useState("");
  const body = ["[사주 상담 신청]", `성함: ${name}`, `연락처: ${contact}`, `주제: ${topic}`, memo && `내용: ${memo}`, "(결과 링크를 함께 보내 주세요)"].filter(Boolean).join("\n");

  return (
    <>
      <h1 className="serif text-2xl font-bold">전문가 상담 신청</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">신청 내용은 문자 앱으로 전달됩니다. 서버에는 저장되지 않으며, 결제는 상담 확정 후 안내됩니다.</p>
      <H2>신청서</H2>
      <Card>
        <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (name.trim() && contact.trim()) window.location.href = `sms:${BRAND.consultPhone}?body=${encodeURIComponent(body)}`; }}>
          <label className="flex flex-col gap-1 text-sm">성함 *<input className={field} value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label className="flex flex-col gap-1 text-sm">연락처 *<input className={field} type="tel" inputMode="tel" placeholder="010-0000-0000" value={contact} onChange={(e) => setContact(e.target.value)} required /></label>
          <label className="flex flex-col gap-1 text-sm">상담 주제<select className={field} value={topic} onChange={(e) => setTopic(e.target.value)}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-sm">궁금한 점<textarea className={field} rows={4} value={memo} onChange={(e) => setMemo(e.target.value)} /></label>
          <button className="rounded-xl bg-[var(--seal)] px-5 py-3 font-semibold text-[var(--on-seal)]">문자로 신청하기</button>
        </form>
      </Card>
    </>
  );
}

export default function BookPage() {
  return <Suspense><Inner /></Suspense>;
}
