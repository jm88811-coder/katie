import Image from "next/image";
import {
  AGENT,
  AMENITIES,
  COMPLEXES,
  DEAL_TYPES,
  HIGHLIGHTS,
  LISTINGS,
  OFFICE,
  PHOTOS,
  REGION,
  REVIEWS,
  SERVICES,
  type Listing,
} from "@/lib/data/realestate";
import { getBlogPosts } from "@/lib/blogFeed";
import { Section, SectionHead } from "@/components/realestate/Section";
import CategoryGrid from "@/components/realestate/CategoryGrid";
import ConsultForm from "@/components/realestate/ConsultForm";
import Insight from "@/components/realestate/Insight";

export const revalidate = 3600;

const NAV = [
  { href: "#listings", label: "대표 매물" },
  { href: "#categories", label: "매물 종류" },
  { href: "#region", label: "지역 소개" },
  { href: "#agent", label: "중개사 소개" },
  { href: "#reviews", label: "고객 후기" },
  { href: "#insight", label: "INSIGHT" },
  { href: "#map", label: "오시는 길" },
  { href: "#consult", label: "상담" },
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const mapQuery = encodeURIComponent(OFFICE.address.replace(/ 상가코너.*$/, ""));

const LICENSE_INFO = [
  OFFICE.representative && `대표 공인중개사 ${OFFICE.representative}`,
  OFFICE.registrationNo && `등록번호 ${OFFICE.registrationNo}`,
].filter(Boolean);

const DEAL_STYLE: Record<Listing["deal"], string> = {
  매매: "bg-red-600 text-white",
  전세: "bg-emerald-600 text-white",
  월세: "bg-amber-400 text-black",
};

function ListingCard({ l }: { l: Listing }) {
  const facts = [
    ["면적", l.area],
    ["층", l.floor],
    ["방향", l.direction],
    ["방/욕실", l.rooms],
    ["입주가능", l.moveIn],
    ["주차", l.parking],
    ["관리비", l.maintenanceFee],
    ["사용승인", l.approvalDate],
  ];
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-background shadow-sm dark:border-white/10">
      <div className="relative aspect-[4/3] bg-black/5 dark:bg-white/5">
        {l.photo && <Image src={l.photo} alt={l.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />}
        <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-xs font-bold ${DEAL_STYLE[l.deal]}`}>{l.deal}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm text-foreground/55">
          {l.complex} · {l.type}
        </p>
        <p className="text-xl font-bold">
          {l.deal} {l.price}
        </p>
        <h3 className="font-medium">{l.title}</h3>
        <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          {facts.map(([k, v]) => (
            <div key={k} className="flex gap-1.5">
              <dt className="text-foreground/50">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-foreground/50">{l.address}</p>
        <a href={`tel:${OFFICE.phone}`} className="mt-auto pt-3 text-sm font-semibold text-red-600 hover:underline dark:text-red-400">
          이 매물 문의하기 →
        </a>
      </div>
    </li>
  );
}

export default async function RealEstatePage() {
  const posts = await getBlogPosts(4);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs leading-tight text-white">더샵</span>
            엘리포레 부동산
            <span className="hidden text-xs font-normal text-foreground/50 sm:inline">오산 서동 단지 내</span>
          </a>
          <nav className="hidden gap-0.5 text-sm lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10">
                {n.label}
              </a>
            ))}
          </nav>
          <a href={`tel:${OFFICE.phone}`} className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            {OFFICE.phone}
          </a>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 text-sm lg:hidden [scrollbar-width:none]">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="shrink-0 rounded-full bg-black/5 px-3 py-1 text-foreground/75 dark:bg-white/10">
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* 01 HERO */}
        <section className="relative isolate overflow-hidden">
          <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
          <div className="mx-auto max-w-6xl px-4 py-20 text-white sm:py-28">
            <p className="mb-4 inline-block rounded-full bg-yellow-300 px-3 py-1 text-sm font-semibold text-black">
              오산 서동 · 더샵오산엘리포레 단지 내 상가 101호
            </p>
            <h1 className="max-w-2xl break-keep text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              {OFFICE.tagline},
              <br />
              <span className="text-red-400">{OFFICE.name}</span>
            </h1>
            <p className="mt-5 max-w-xl break-keep text-lg text-white/80">
              엘리포레·세교 아파트와 분양권, 상가·토지까지. 단지를 가장 가까이에서 아는 중개사가 대출·양도세 상담까지 함께합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${OFFICE.phone}`} className="rounded-full bg-red-600 px-6 py-3 font-semibold hover:bg-red-700">
                ☎ {OFFICE.phone}
              </a>
              <a href="#consult" className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-white/90">
                상담 신청
              </a>
              <a href="#listings" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">
                매물 보기
              </a>
            </div>
            <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-4">
              {HIGHLIGHTS.map((s) => (
                <div key={s.k} className="bg-black/40 p-4 backdrop-blur">
                  <dt className="text-xs text-white/60">{s.k}</dt>
                  <dd className="mt-1 font-bold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 02 대표 매물 */}
        <Section id="listings">
          <SectionHead
            no="02"
            eyebrow="LISTINGS"
            title="대표 매물"
            desc={LISTINGS.length > 0 ? "엄선한 대표 매물입니다. 비공개 매물은 전화로 안내해 드립니다." : "매물은 수시로 바뀌어 전화로 가장 정확하게 안내해 드립니다. 단지를 고르시면 바로 연결됩니다."}
          />
          {LISTINGS.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {LISTINGS.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COMPLEXES.map((c, i) => (
                <li
                  key={c.name}
                  className={`flex flex-col gap-3 rounded-2xl border p-6 ${
                    i === 0 ? "border-red-600 bg-red-600 text-white" : "border-black/10 bg-background dark:border-white/10"
                  }`}
                >
                  <span className={`text-xs font-semibold ${i === 0 ? "text-yellow-300" : "text-red-600 dark:text-red-400"}`}>
                    {i === 0 ? "사무소가 있는 단지" : "취급 단지"}
                  </span>
                  <h3 className="break-keep text-xl font-bold">{c.name}</h3>
                  <p className={`text-sm ${i === 0 ? "text-white/80" : "text-foreground/60"}`}>{c.note.replace("사무소가 위치한 단지 · ", "")}</p>
                  <a
                    href={`tel:${OFFICE.phone}`}
                    className={`mt-auto rounded-full px-4 py-2 text-center text-sm font-semibold ${
                      i === 0 ? "bg-white text-red-700 hover:bg-white/90" : "bg-foreground text-background hover:opacity-90"
                    }`}
                  >
                    현재 매물 문의
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* 03 매물 카테고리 */}
        <Section id="categories" tinted>
          <SectionHead no="03" eyebrow="CATEGORY" title="어떤 매물을 찾으세요?" desc="종류를 누르면 상담 신청서에 바로 채워집니다." />
          <CategoryGrid />
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-foreground/55">거래 유형</span>
            {DEAL_TYPES.map((t) => (
              <span key={t} className="rounded-full bg-yellow-300 px-3 py-1 font-semibold text-black">
                {t}
              </span>
            ))}
          </div>
        </Section>

        {/* 04 지역 소개 */}
        <Section id="region">
          <SectionHead no="04" eyebrow="AREA" title={REGION.title} desc={REGION.intro} />
          <div className="grid gap-4 md:grid-cols-3">
            {REGION.points.map((p) => (
              <div key={p.k} className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
                <p className="text-sm text-foreground/55">{p.k}</p>
                <p className="mt-1 text-lg font-bold text-red-600 dark:text-red-400">{p.v}</p>
                <p className="mt-1 text-sm text-foreground/60">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <ol className="flex flex-col gap-3">
              {COMPLEXES.map((c, i) => (
                <li key={c.name} className="flex items-start gap-4 rounded-xl bg-black/[0.03] p-4 dark:bg-white/[0.04]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-foreground/60">{c.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* 05 중개사 소개 */}
        <Section id="agent" tinted>
          <SectionHead no="05" eyebrow="AGENT" title="중개사 소개" />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-80">
              <Image
                src={AGENT.photo || PHOTOS[2].src}
                alt={AGENT.photo ? "대표 공인중개사" : PHOTOS[2].alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm text-foreground/55">{OFFICE.fullName}</p>
                <p className="mt-1 text-2xl font-bold">
                  {OFFICE.representative ? `대표 공인중개사 ${OFFICE.representative}` : "대표 공인중개사"}
                </p>
                {OFFICE.registrationNo && <p className="mt-1 text-sm text-foreground/55">중개사무소 등록번호 {OFFICE.registrationNo}</p>}
                <p className="mt-4 break-keep leading-relaxed text-foreground/75">“{AGENT.greeting}”</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-3">
                {AGENT.strengths.map((s) => (
                  <li key={s.title} className="rounded-xl bg-background p-4 dark:bg-white/[0.04]">
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-1 break-keep text-sm text-foreground/60">{s.body}</p>
                  </li>
                ))}
              </ul>
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground/60">상담 분야</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <span key={s.title} className="rounded-full border border-black/10 bg-background px-3 py-1 text-sm dark:border-white/15">
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 06 고객 후기 */}
        <Section id="reviews">
          <SectionHead no="06" eyebrow="REVIEWS" title="고객 후기" />
          {REVIEWS.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {REVIEWS.map((r) => (
                <figure key={`${r.name}-${r.date}`} className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
                  <blockquote className="break-keep leading-relaxed text-foreground/80">“{r.body}”</blockquote>
                  <figcaption className="mt-4 text-sm text-foreground/55">
                    {r.name} · {r.tag} · {r.date}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-5 rounded-2xl border border-black/10 p-8 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <div>
                <p className="text-lg font-semibold">실제 방문 고객의 리뷰는 네이버 플레이스에서 확인하세요.</p>
                <p className="mt-1 text-sm text-foreground/60">계약을 마친 고객님의 동의를 받아 이곳에도 후기를 소개할 예정입니다.</p>
              </div>
              <a href={OFFICE.mapUrl} {...ext} className="shrink-0 rounded-full bg-[#03C75A] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
                네이버 리뷰 보기
              </a>
            </div>
          )}
        </Section>

        {/* 07 부동산 INSIGHT */}
        <Section id="insight" tinted>
          <SectionHead no="07" eyebrow="INSIGHT" title="부동산 INSIGHT" desc="오산 규제 현황, 사무소 블로그와 주요 기사, 거래 전에 알아둘 기본 가이드를 모았습니다." />
          <Insight posts={posts} />
        </Section>

        {/* 08 지도 */}
        <Section id="map">
          <SectionHead no="08" eyebrow="LOCATION" title="오시는 길" />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <iframe
                title={`${OFFICE.fullName} 위치 지도`}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=17&output=embed`}
                className="h-80 w-full sm:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-5">
              <dl className="grid grid-cols-[4.5rem_1fr] gap-y-3 text-sm">
                <dt className="text-foreground/55">주소</dt>
                <dd>
                  {OFFICE.address}
                  <br />
                  <span className="text-foreground/60">{OFFICE.addressDetail}</span>
                </dd>
                <dt className="text-foreground/55">주차</dt>
                <dd>{OFFICE.parking}</dd>
                <dt className="text-foreground/55">방문</dt>
                <dd>{OFFICE.visitNote}</dd>
              </dl>
              <div className="flex flex-wrap gap-2">
                <a href={OFFICE.mapUrl} {...ext} className="rounded-full bg-[#03C75A] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                  네이버 지도
                </a>
                <a
                  href={`https://map.kakao.com/link/search/${mapQuery}`}
                  {...ext}
                  className="rounded-full bg-[#FEE500] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
                >
                  카카오맵
                </a>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground/60">편의시설</p>
                <div className="flex flex-wrap gap-1.5">
                  {AMENITIES.map((a) => (
                    <span key={a} className="rounded-full border border-black/10 px-3 py-1 text-xs dark:border-white/15">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 09 상담 */}
        <Section id="consult" tinted>
          <SectionHead no="09" eyebrow="CONTACT" title="매물 접수 · 상담 신청" desc="문자 또는 전화로 편하게 연락 주세요. 매물을 내놓으시는 분도 환영합니다." />
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
              <ConsultForm mobile={OFFICE.mobile} />
            </div>
            <div className="flex flex-col gap-3">
              <a href={`tel:${OFFICE.phone}`} className="rounded-2xl bg-red-600 p-6 text-white hover:bg-red-700">
                <span className="text-sm text-white/75">사무실 전화</span>
                <span className="mt-1 block text-2xl font-bold">{OFFICE.phone}</span>
              </a>
              <a href={`tel:${OFFICE.mobile}`} className="rounded-2xl border border-black/10 bg-background p-6 hover:border-red-500 dark:border-white/10">
                <span className="text-sm text-foreground/55">휴대폰 (문자 가능)</span>
                <span className="mt-1 block text-2xl font-bold">{OFFICE.mobile}</span>
              </a>
              <a href={OFFICE.blogUrl} {...ext} className="rounded-2xl border border-black/10 bg-background p-6 hover:border-red-500 dark:border-white/10">
                <span className="text-sm text-foreground/55">블로그</span>
                <span className="mt-1 block font-semibold">매물·단지 소식 보러 가기 →</span>
              </a>
            </div>
          </div>
        </Section>
      </main>

      {/* 10 FOOTER */}
      <footer className="bg-neutral-900 text-white/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs leading-tight">더샵</span>
              엘리포레 부동산
            </p>
            <p className="mt-3 leading-relaxed">
              {[OFFICE.fullName, ...LICENSE_INFO].join(" · ")}
              <br />
              {OFFICE.address}
              <br />
              TEL {OFFICE.phone} · Mobile {OFFICE.mobile}
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/45">
          게시된 정보는 변동될 수 있으며, 정확한 내용은 방문·전화 상담으로 확인해 주세요.
        </div>
      </footer>

      <a
        href={`tel:${OFFICE.phone}`}
        className="fixed bottom-4 right-4 z-30 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
      >
        ☎ 전화 상담
      </a>
    </div>
  );
}
