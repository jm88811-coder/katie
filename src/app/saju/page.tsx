import Link from "next/link";
import { BirthForm, Card, H2, SavedProfiles, StreakBadge } from "@/components/saju/ui";
import { BRAND, FAQ } from "@/lib/saju/content";

const SERVICES = [
  { href: "/saju/result", t: "종합 사주·만세력", d: "4주·오행·십성·용신·대운 전부 무료" },
  { href: "/saju/today", t: "오늘의 운세", d: "내 일간 기준, 매일 달라지는 4대 운세" },
  { href: "/saju/year", t: "2027 신년운세", d: "세운·월운으로 보는 12개월 흐름" },
  { href: "/saju/match", t: "궁합", d: "일간·일지·띠·오행 보완 4가지 분석" },
];

const COMPARE: [string, string, string][] = [
  ["가입·로그인", "필요 없음", "대부분 필요"],
  ["만세력·대운", "전부 무료", "일부 유료"],
  ["오늘의 운세", "내 일간 맞춤 + 스트릭 보상", "띠별 일반 운세"],
  ["개인정보", "서버 저장 없음", "서버 저장"],
  ["심층 리포트", "방문 보상으로 무료 해제", "건당 결제"],
  ["계산 근거", "절기·진태양시 공개", "비공개"],
];

export default function SajuHome() {
  return (
    <>
      <section className="py-4 text-center">
        <p className="mb-2 text-sm text-[var(--seal)]">무료 · 가입 없음 · 서버 저장 없음</p>
        <h1 className="serif text-3xl font-bold leading-tight sm:text-4xl">{BRAND.tagline}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--ink-soft)]">
          절기 천문 계산 기반 만세력으로 사주팔자, 오행, 십성, 용신, 10년 대운까지 한 번에 확인하세요.
        </p>
        <div className="mt-4"><StreakBadge /></div>
      </section>

      <Card className="mt-6">
        <BirthForm />
        <SavedProfiles />
      </Card>

      <H2 sub="모두 가입 없이 무료">서비스</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <Link key={s.href} href={s.href} className="card block p-4 hover:border-[var(--seal)]">
            <div className="serif font-bold">{s.t}</div>
            <div className="mt-1 text-sm text-[var(--ink-soft)]">{s.d}</div>
          </Link>
        ))}
      </div>

      <H2 sub="일반적인 사주 사이트와 비교했을 때">왜 {BRAND.name}인가요</H2>
      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-xs text-[var(--ink-soft)]">
              <th className="p-3 font-normal">항목</th><th className="p-3 text-[var(--seal)]">{BRAND.name}</th><th className="p-3 font-normal">일반 사이트</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map(([a, b, c]) => (
              <tr key={a} className="border-b border-[var(--line)] last:border-0">
                <td className="p-3">{a}</td><td className="p-3 font-semibold">{b}</td><td className="p-3 text-[var(--ink-soft)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <H2>자주 묻는 질문</H2>
      <div className="flex flex-col gap-2">
        {FAQ.map((f) => (
          <details key={f.q} className="card p-4">
            <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
