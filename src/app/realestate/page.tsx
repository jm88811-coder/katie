import Image from "next/image";
import {
  AMENITIES,
  BADGES,
  COMPLEXES,
  DEAL_TYPES,
  HIGHLIGHTS,
  KEYWORDS,
  OFFICE,
  PHOTOS,
  PROPERTY_TYPES,
  SERVICES,
} from "@/lib/data/realestate";
import { FEE_TABLE, GUIDE_TOPICS } from "@/lib/data/realestateGuide";
import { NEWS, OFFICIAL_LINKS, REGULATION_ASOF, REGULATIONS } from "@/lib/data/realestateNews";
import { getBlogPosts } from "@/lib/blogFeed";
import ConsultForm from "@/components/realestate/ConsultForm";

const NAV = [
  { href: "#complexes", label: "취급 단지" },
  { href: "#services", label: "중개·상담" },
  { href: "#guide", label: "부동산 가이드" },
  { href: "#news", label: "소식·규제" },
  { href: "#office", label: "사무소" },
  { href: "#contact", label: "상담·오시는 길" },
];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-red-600 dark:text-red-400">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}

export const revalidate = 3600;

const LICENSE_INFO = [
  OFFICE.representative && `대표 공인중개사 ${OFFICE.representative}`,
  OFFICE.registrationNo && `등록번호 ${OFFICE.registrationNo}`,
].filter(Boolean);

export default async function RealEstatePage() {
  const posts = await getBlogPosts(4);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs leading-tight text-white">더샵</span>
            엘리포레 부동산
            <span className="hidden text-xs font-normal text-foreground/50 sm:inline">오산 서동 단지 내</span>
          </a>
          <nav className="hidden gap-1 text-sm md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10">
                {n.label}
              </a>
            ))}
          </nav>
          <a href={`tel:${OFFICE.phone}`} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            {OFFICE.phone}
          </a>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-red-50 to-background dark:from-red-950/30">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 inline-block rounded-full bg-yellow-300 px-3 py-1 text-sm font-semibold text-black">
                오산 서동 · 더샵오산엘리포레 단지 내 상가 101호
              </p>
              <h1 className="text-balance break-keep text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {OFFICE.tagline},
                <br />
                <span className="text-red-600 dark:text-red-400">{OFFICE.name}</span>
              </h1>
              <p className="mt-5 max-w-xl break-keep text-lg text-foreground/70">{OFFICE.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${OFFICE.phone}`} className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700">
                  ☎ {OFFICE.phone}
                </a>
                <a href={`tel:${OFFICE.mobile}`} className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
                  휴대폰 {OFFICE.mobile}
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill priority sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 pb-14">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {HIGHLIGHTS.map((s) => (
                <div key={s.k} className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                  <dt className="text-xs text-foreground/55">{s.k}</dt>
                  <dd className="mt-1 font-bold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="complexes" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionTitle eyebrow="COMPLEXES" title="주요 취급 단지" />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMPLEXES.map((c, i) => (
              <li
                key={c.name}
                className={`rounded-2xl border p-5 ${
                  i === 0 ? "border-red-600 bg-red-600 text-white" : "border-black/10 dark:border-white/10"
                }`}
              >
                <h3 className="text-lg font-bold">{c.name}</h3>
                <p className={`mt-1 text-sm ${i === 0 ? "text-white/85" : "text-foreground/60"}`}>{c.note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-black/[0.03] p-5 dark:bg-white/[0.04]">
              <p className="mb-3 text-sm font-semibold text-foreground/60">취급 매물</p>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <span key={t} className="rounded-full bg-background px-4 py-1.5 text-sm font-medium shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-black/[0.03] p-5 dark:bg-white/[0.04]">
              <p className="mb-3 text-sm font-semibold text-foreground/60">거래 유형</p>
              <div className="flex flex-wrap gap-2">
                {DEAL_TYPES.map((t) => (
                  <span key={t} className="rounded-full bg-yellow-300 px-4 py-1.5 text-sm font-semibold text-black">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-foreground/60">
            찾으시는 매물이 있으면 언제든 전화 주세요. 신속하게 처리해 드립니다.
          </p>
        </section>

        <section id="services" className="scroll-mt-20 bg-black/[0.03] py-16 dark:bg-white/[0.03]">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle eyebrow="SERVICES" title="중개부터 대출·세금 상담까지" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div key={s.title} className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{s.body}</p>
                </div>
              ))}
            </div>
            <ul className="mt-8 grid gap-3 md:grid-cols-3">
              {BADGES.map((b) => (
                <li key={b} className="flex items-start gap-2 rounded-xl bg-background p-4 text-sm font-medium dark:bg-white/[0.04]">
                  <span className="text-red-600 dark:text-red-400">※</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="guide" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionTitle eyebrow="GUIDE" title="알아두면 든든한 부동산 기본 가이드" />
          <div className="flex flex-col gap-3">
            {GUIDE_TOPICS.map((t, i) => (
              <details
                key={t.id}
                open={i === 0}
                className="group rounded-2xl border border-black/10 open:bg-black/[0.02] dark:border-white/10 dark:open:bg-white/[0.03]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-lg font-semibold">{t.title}</span>
                    <span className="text-sm text-foreground/55">{t.summary}</span>
                  </span>
                  <span className="text-xl text-red-600 transition group-open:rotate-45 dark:text-red-400">+</span>
                </summary>
                <dl className="grid gap-x-8 gap-y-4 px-5 pb-6 md:grid-cols-2">
                  {t.items.map((it) => (
                    <div key={it.head}>
                      <dt className="font-semibold">{it.head}</dt>
                      <dd className="mt-1 break-keep text-sm leading-relaxed text-foreground/70">{it.body}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}

            <details className="group rounded-2xl border border-black/10 open:bg-black/[0.02] dark:border-white/10 dark:open:bg-white/[0.03]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block text-lg font-semibold">주택 중개보수 상한요율 (경기도)</span>
                  <span className="text-sm text-foreground/55">거래금액별 최대 요율과 한도액</span>
                </span>
                <span className="text-xl text-red-600 transition group-open:rotate-45 dark:text-red-400">+</span>
              </summary>
              <div className="grid gap-6 px-5 pb-6 md:grid-cols-2">
                {[
                  { label: "매매·교환", rows: FEE_TABLE.sale },
                  { label: "전세·월세", rows: FEE_TABLE.lease },
                ].map((tbl) => (
                  <table key={tbl.label} className="w-full text-sm">
                    <caption className="mb-2 text-left font-semibold">{tbl.label}</caption>
                    <thead>
                      <tr className="border-b border-black/10 text-left text-foreground/55 dark:border-white/10">
                        <th className="py-2 font-medium">거래금액</th>
                        <th className="py-2 font-medium">상한요율</th>
                        <th className="py-2 font-medium">한도액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.rows.map((r) => (
                        <tr key={r.range} className="border-b border-black/5 dark:border-white/5">
                          <td className="py-2">{r.range}</td>
                          <td className="py-2 font-semibold">{r.rate}</td>
                          <td className="py-2">{r.cap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
                <p className="text-xs text-foreground/55 md:col-span-2">
                  월세 거래금액 = 보증금 + (월세 × 100). 단, 이 금액이 5천만 원 미만이면 보증금 + (월세 × 70)으로 계산합니다.
                  표의 요율은 상한이며 실제 보수는 협의로 정하고, 부가가치세는 별도입니다. 청년지원 동행부동산 할인도 문의하세요.
                </p>
              </div>
            </details>
          </div>
          <p className="mt-6 text-xs text-foreground/50">
            위 내용은 일반적인 안내이며 세율·요건은 법령 개정과 개인 상황에 따라 달라질 수 있습니다. 실제 거래 전에는 사무소 또는 세무 전문가와 꼭 상담하세요.
          </p>
        </section>

        <section id="news" className="scroll-mt-20 bg-black/[0.03] py-16 dark:bg-white/[0.03]">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle eyebrow="NEWS & POLICY" title="오산 부동산 소식·규제 한눈에" />

            <div className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold">오산 규제 현황</h3>
                <span className="rounded-full bg-yellow-300 px-3 py-0.5 text-xs font-semibold text-black">{REGULATION_ASOF} 기준</span>
              </div>
              <ul className="grid gap-6 md:grid-cols-3">
                {REGULATIONS.map((r) => (
                  <li key={r.title} className="flex flex-col gap-1.5">
                    <span className="text-sm text-foreground/55">{r.title}</span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">{r.status}</span>
                    <p className="break-keep text-sm leading-relaxed text-foreground/70">{r.body}</p>
                    <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground/50 underline hover:text-foreground">
                      출처: {r.source.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-foreground/50">
                규제는 정부 발표에 따라 수시로 바뀝니다. 거래 전 아래 공식 사이트나 사무소 상담으로 최신 내용을 꼭 확인하세요.
              </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
                <div className="mb-4 flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold">사무소 블로그 새 글</h3>
                  <a href={OFFICE.blogUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/55 hover:underline">
                    전체 보기 →
                  </a>
                </div>
                {posts.length > 0 ? (
                  <ul className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
                    {posts.map((p) => (
                      <li key={p.link} className="py-3 first:pt-0 last:pb-0">
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="group block">
                          <span className="font-medium group-hover:underline">{p.title}</span>
                          {p.excerpt && <span className="mt-0.5 block text-sm text-foreground/60">{p.excerpt}</span>}
                          {p.date && <span className="mt-0.5 block text-xs text-foreground/45">{p.date}</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-start gap-4">
                    <p className="text-sm text-foreground/60">매물 소식, 단지 정보, 분양권 시세 이야기를 블로그에 꾸준히 올리고 있습니다.</p>
                    <a
                      href={OFFICE.blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#03C75A] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                    >
                      네이버 블로그 바로가기
                    </a>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
                <h3 className="mb-4 text-lg font-bold">오산 부동산 주요 기사</h3>
                <ul className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
                  {NEWS.map((n) => (
                    <li key={n.url} className="py-3 first:pt-0 last:pb-0">
                      <a href={n.url} target="_blank" rel="noopener noreferrer" className="group block">
                        <span className="font-medium group-hover:underline">{n.title}</span>
                        <span className="mt-0.5 block text-xs text-foreground/45">
                          {n.press} · {n.date}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-foreground/45">기사 내용은 각 언론사에 있으며, 제목을 누르면 원문으로 이동합니다.</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground/60">바로가는 공식 사이트</h3>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {OFFICIAL_LINKS.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full rounded-xl border border-black/10 bg-background p-4 hover:border-red-500 dark:border-white/10"
                    >
                      <span className="block font-semibold">{l.label}</span>
                      <span className="mt-0.5 block text-xs text-foreground/55">{l.desc}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="office" className="scroll-mt-20 py-16">
          <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="OFFICE" title="사무소 둘러보기" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {PHOTOS.map((p) => (
              <div key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold text-foreground/60">편의시설 및 서비스</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <span key={a} className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/15">
                  {a}
                </span>
              ))}
            </div>
          </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 bg-black/[0.03] py-16 dark:bg-white/[0.03]">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle eyebrow="CONTACT" title="매물 접수 · 상담 신청" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
                <ConsultForm mobile={OFFICE.mobile} />
              </div>
              <div className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
                <dl className="grid grid-cols-[5rem_1fr] gap-y-3 text-sm">
                  {OFFICE.representative && (
                    <>
                      <dt className="text-foreground/55">대표</dt>
                      <dd>공인중개사 {OFFICE.representative}</dd>
                    </>
                  )}
                  {OFFICE.registrationNo && (
                    <>
                      <dt className="text-foreground/55">등록번호</dt>
                      <dd>{OFFICE.registrationNo}</dd>
                    </>
                  )}
                  <dt className="text-foreground/55">주소</dt>
                  <dd>
                    {OFFICE.address}
                    <br />
                    <span className="text-foreground/60">{OFFICE.addressDetail}</span>
                  </dd>
                  <dt className="text-foreground/55">전화</dt>
                  <dd>
                    <a href={`tel:${OFFICE.phone}`} className="font-semibold hover:underline">{OFFICE.phone}</a>
                  </dd>
                  <dt className="text-foreground/55">휴대폰</dt>
                  <dd>
                    <a href={`tel:${OFFICE.mobile}`} className="font-semibold hover:underline">{OFFICE.mobile}</a>
                  </dd>
                  <dt className="text-foreground/55">주차</dt>
                  <dd>{OFFICE.parking}</dd>
                  <dt className="text-foreground/55">방문</dt>
                  <dd>{OFFICE.visitNote}</dd>
                </dl>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={OFFICE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#03C75A] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    네이버 지도·리뷰 보기
                  </a>
                  <a
                    href={OFFICE.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                  >
                    블로그 소식 보기
                  </a>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {KEYWORDS.map((k) => (
                    <span key={k} className="text-xs text-foreground/50">#{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 py-8 text-center text-xs leading-relaxed text-foreground/50 dark:border-white/10">
        <p>{[OFFICE.fullName, ...LICENSE_INFO].join(" · ")}</p>
        <p>
          {OFFICE.address} · TEL {OFFICE.phone} · Mobile {OFFICE.mobile}
        </p>
      </footer>

      {/* 모바일 하단 고정 전화 버튼 */}
      <a
        href={`tel:${OFFICE.phone}`}
        className="fixed bottom-4 right-4 z-30 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
      >
        ☎ 전화 상담
      </a>
    </div>
  );
}
