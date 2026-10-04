import { LISTINGS, OFFICE, PROCESS, REVIEWS, SERVICES } from "@/lib/data/realestate";
import ListingBoard from "@/components/realestate/ListingBoard";
import ConsultForm from "@/components/realestate/ConsultForm";

const NAV = [
  { href: "#listings", label: "추천 매물" },
  { href: "#services", label: "중개 서비스" },
  { href: "#process", label: "진행 절차" },
  { href: "#reviews", label: "고객 후기" },
  { href: "#contact", label: "상담·오시는 길" },
];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}

export default function RealEstatePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="text-lg font-bold tracking-tight">
            {OFFICE.name}
          </a>
          <nav className="hidden gap-1 text-sm md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10">
                {n.label}
              </a>
            ))}
          </nav>
          <a href={`tel:${OFFICE.phone}`} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {OFFICE.phone}
          </a>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 inline-block rounded-full bg-blue-600/10 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                {OFFICE.representative}
              </p>
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{OFFICE.tagline}</h1>
              <p className="mt-5 max-w-xl text-lg text-foreground/70">
                아파트·빌라·오피스텔·상가까지, 지역 시세를 가장 잘 아는 공인중개사가 안전한 계약을 약속드립니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#listings" className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
                  추천 매물 보기
                </a>
                <a href="#contact" className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
                  무료 상담 신청
                </a>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              {[
                { k: "지역 중개 경력", v: "10년+" },
                { k: "누적 계약", v: "1,200건" },
                { k: "보유 매물", v: `${LISTINGS.length}건+` },
                { k: "고객 재방문율", v: "92%" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-black/10 bg-background p-5 dark:border-white/10">
                  <dt className="text-sm text-foreground/60">{s.k}</dt>
                  <dd className="mt-1 text-2xl font-bold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="listings" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionTitle eyebrow="LISTINGS" title="이번 주 추천 매물" />
          <ListingBoard listings={LISTINGS} phone={OFFICE.phone} />
        </section>

        <section id="services" className="scroll-mt-20 bg-black/[0.03] py-16 dark:bg-white/[0.03]">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle eyebrow="SERVICES" title="이런 일을 도와드립니다" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div key={s.title} className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionTitle eyebrow="PROCESS" title="계약까지 이렇게 진행됩니다" />
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <li key={p.step} className="border-t-2 border-blue-600 pt-4">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">STEP {p.step}</span>
                <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-foreground/65">{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="reviews" className="scroll-mt-20 bg-black/[0.03] py-16 dark:bg-white/[0.03]">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle eyebrow="REVIEWS" title="고객님들의 이야기" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
                  <blockquote className="leading-relaxed text-foreground/80">“{r.body}”</blockquote>
                  <figcaption className="mt-4 text-sm text-foreground/55">
                    {r.name} · {r.tag}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionTitle eyebrow="CONTACT" title="상담 신청 · 오시는 길" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
              <ConsultForm mobile={OFFICE.mobile} />
            </div>
            <div className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/10">
              <dl className="grid grid-cols-[5rem_1fr] gap-y-3 text-sm">
                <dt className="text-foreground/55">주소</dt>
                <dd>{OFFICE.address}</dd>
                <dt className="text-foreground/55">대표전화</dt>
                <dd>
                  <a href={`tel:${OFFICE.phone}`} className="font-semibold hover:underline">{OFFICE.phone}</a>
                </dd>
                <dt className="text-foreground/55">휴대폰</dt>
                <dd>
                  <a href={`tel:${OFFICE.mobile}`} className="font-semibold hover:underline">{OFFICE.mobile}</a>
                </dd>
                <dt className="text-foreground/55">이메일</dt>
                <dd>
                  <a href={`mailto:${OFFICE.email}`} className="hover:underline">{OFFICE.email}</a>
                </dd>
                <dt className="text-foreground/55">영업시간</dt>
                <dd className="flex flex-col gap-1">
                  {OFFICE.hours.map((h) => (
                    <span key={h.day}>
                      <span className="inline-block w-20 text-foreground/70">{h.day}</span>
                      {h.time}
                    </span>
                  ))}
                </dd>
              </dl>
              <div className="flex flex-wrap gap-3">
                <a
                  href={OFFICE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#03C75A] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  네이버 지도에서 보기
                </a>
                {OFFICE.kakaoUrl && (
                  <a
                    href={OFFICE.kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#FEE500] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
                  >
                    카카오톡 상담
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 py-8 text-center text-xs leading-relaxed text-foreground/50 dark:border-white/10">
        <p>
          {OFFICE.name} · {OFFICE.representative} · {OFFICE.registrationNo}
        </p>
        <p>
          {OFFICE.address} · {OFFICE.phone}
        </p>
        <p className="mt-2">게시된 매물 정보는 변동될 수 있으며, 정확한 내용은 방문·전화 상담으로 확인해 주세요.</p>
      </footer>

      {/* 모바일 하단 고정 전화 버튼 */}
      <a
        href={`tel:${OFFICE.phone}`}
        className="fixed bottom-4 right-4 z-30 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
      >
        전화 상담
      </a>
    </div>
  );
}
