import Link from "next/link";
import SpclBadge from "@/components/spcl/SpclBadge";
import ConsultForm from "@/components/spcl/ConsultForm";
import { SPCL_KEYS, SPCL_META } from "@/lib/spcl/types";

// 샘플 데이터: 실제 실적·후기로 교체하세요.
const STATS = [
  { v: "20만+", l: "누적 팔로워(샘플)" },
  { v: "1억+", l: "누적 조회수(샘플)" },
  { v: "50+", l: "운영 계정(샘플)" },
];

const EXPERIENCE = [
  { t: "세무 전문 계정 0→3만 팔로워", d: "6개월간 주 7회 발행, 월 상담 문의 12건으로 연결(샘플)" },
  { t: "피부과 원장 계정 리브랜딩", d: "시술 후기·경과 중심으로 전환 후 예약 문의 2배(샘플)" },
];

const TIPS = [
  "릴스 첫 3초는 자기소개 말고 결론부터",
  "정보 글 끝에 '오늘 해볼 1가지'를 넣기",
  "조회수 대신 문의·저장 수를 주 1회 기록",
];

const PROOFS = [
  { q: "조회수는 3천인데 문의가 10건 왔어요.", w: "세무사 대표님(샘플 후기)" },
  { q: "후기 콘텐츠를 올린 뒤 상담 전환이 확실히 달라졌습니다.", w: "컨설턴트 대표님(샘플 후기)" },
];

export default function SpclHome() {
  return (
    <div className="flex flex-col gap-20">
      <section className="flex flex-col gap-5">
        <SpclBadge k="S" />
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          조회수가 아니라,<br />
          <span className="text-violet-600">고객을 만드는 콘텐츠</span>
        </h1>
        <p className="max-w-2xl text-foreground/70">
          관심을 신뢰로, 신뢰를 행동으로, 행동을 구매로. 자격·따라하기·증거·나다움,
          네 가지 콘텐츠를 꾸준히 쌓는 전문직·사업가용 콘텐츠 전략입니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/spcl/planner" className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700">
            무료 SPCL 기획 도구 써보기
          </Link>
          <a href="#consult" className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold dark:border-white/15">상담 신청</a>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.l} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <dt className="text-xs text-foreground/60">{s.l}</dt>
              <dd className="text-2xl font-bold">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {SPCL_KEYS.map((k) => (
          <div key={k} className="rounded-xl border border-black/10 p-5 dark:border-white/10">
            <SpclBadge k={k} />
            <p className="mt-3 text-sm text-foreground/80">{SPCL_META[k].question}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SpclBadge k="S" />
        <h2 className="text-2xl font-bold">직접 해본 일</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {EXPERIENCE.map((e) => (
            <li key={e.t} className="rounded-xl border border-black/10 p-5 dark:border-white/10">
              <p className="font-semibold">{e.t}</p>
              <p className="mt-1 text-sm text-foreground/70">{e.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <SpclBadge k="P" />
        <h2 className="text-2xl font-bold">오늘 바로 따라 해보세요</h2>
        <ol className="list-decimal space-y-2 pl-5 text-foreground/80">
          {TIPS.map((t) => <li key={t}>{t}</li>)}
        </ol>
      </section>

      <section id="proof" className="flex flex-col gap-4">
        <SpclBadge k="C" />
        <h2 className="text-2xl font-bold">말이 아니라 증거</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROOFS.map((p) => (
            <blockquote key={p.q} className="rounded-xl border border-black/10 p-5 dark:border-white/10">
              <p>“{p.q}”</p>
              <footer className="mt-2 text-xs text-foreground/60">— {p.w}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SpclBadge k="L" />
        <h2 className="text-2xl font-bold">저는 이런 사람입니다</h2>
        <p className="max-w-2xl text-foreground/80">
          (샘플) 처음엔 조회수만 쫓다 문의가 하나도 없던 시기가 있었습니다. 그때부터 ‘누가 보고, 무엇을 하게 만드는가’로
          기준을 바꿨습니다. 이 소개글을 실제 이야기로 교체하세요.
        </p>
      </section>

      <section id="consult" className="rounded-2xl border border-violet-500/30 p-6">
        <h2 className="mb-4 text-2xl font-bold">상담 신청</h2>
        <ConsultForm email="hello@example.com" />
      </section>
    </div>
  );
}
