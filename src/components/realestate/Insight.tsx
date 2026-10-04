import { OFFICE } from "@/lib/data/realestate";
import { FEE_TABLE, GUIDE_TOPICS } from "@/lib/data/realestateGuide";
import { NEWS, OFFICIAL_LINKS, REGULATION_ASOF, REGULATIONS } from "@/lib/data/realestateNews";
import type { BlogPost } from "@/lib/blogFeed";

const card = "rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Accordion({ title, summary, children }: { title: string; summary: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-black/10 bg-background open:shadow-sm dark:border-white/10">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="text-sm text-foreground/55">{summary}</span>
        </span>
        <span className="text-xl text-red-600 transition group-open:rotate-45 dark:text-red-400">+</span>
      </summary>
      <div className="px-5 pb-6">{children}</div>
    </details>
  );
}

export default function Insight({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className={card}>
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
              <a href={r.source.url} {...ext} className="text-xs text-foreground/50 underline hover:text-foreground">
                출처: {r.source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold">사무소 블로그 새 글</h3>
            <a href={OFFICE.blogUrl} {...ext} className="text-sm text-foreground/55 hover:underline">
              전체 보기 →
            </a>
          </div>
          {posts.length > 0 ? (
            <ul className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
              {posts.map((p) => (
                <li key={p.link} className="py-3 first:pt-0 last:pb-0">
                  <a href={p.link} {...ext} className="group block">
                    <span className="font-medium group-hover:underline">{p.title}</span>
                    {p.excerpt && <span className="mt-0.5 block text-sm text-foreground/60">{p.excerpt}</span>}
                    {p.date && <span className="mt-0.5 block text-xs text-foreground/45">{p.date}</span>}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm text-foreground/60">매물 소식, 단지 정보, 분양권 이야기를 블로그에 꾸준히 올리고 있습니다.</p>
              <a href={OFFICE.blogUrl} {...ext} className="rounded-full bg-[#03C75A] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                네이버 블로그 바로가기
              </a>
            </div>
          )}
        </div>

        <div className={card}>
          <h3 className="mb-4 text-lg font-bold">오산 부동산 주요 기사</h3>
          <ul className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
            {NEWS.map((n) => (
              <li key={n.url} className="py-3 first:pt-0 last:pb-0">
                <a href={n.url} {...ext} className="group block">
                  <span className="font-medium group-hover:underline">{n.title}</span>
                  <span className="mt-0.5 block text-xs text-foreground/45">
                    {n.press} · {n.date}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-foreground/45">제목을 누르면 언론사 원문으로 이동합니다.</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-bold">알아두면 든든한 부동산 기본 가이드</h3>
        <div className="flex flex-col gap-3">
          {GUIDE_TOPICS.map((t) => (
            <Accordion key={t.id} title={t.title} summary={t.summary}>
              <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                {t.items.map((it) => (
                  <div key={it.head}>
                    <dt className="font-semibold">{it.head}</dt>
                    <dd className="mt-1 break-keep text-sm leading-relaxed text-foreground/70">{it.body}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
          ))}
          <Accordion title="주택 중개보수 상한요율 (경기도)" summary="거래금액별 최대 요율과 한도액">
            <div className="grid gap-6 md:grid-cols-2">
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
                표의 요율은 상한이며 실제 보수는 협의로 정하고, 부가가치세는 별도입니다.
              </p>
            </div>
          </Accordion>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground/60">바로가는 공식 사이트</h3>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {OFFICIAL_LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} {...ext} className="block h-full rounded-xl border border-black/10 bg-background p-4 hover:border-red-500 dark:border-white/10">
                <span className="block font-semibold">{l.label}</span>
                <span className="mt-0.5 block text-xs text-foreground/55">{l.desc}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-foreground/50">
        규제·세율은 정부 발표와 법령 개정에 따라 바뀔 수 있습니다. 실제 거래 전에는 사무소 또는 세무 전문가와 꼭 상담하세요.
      </p>
    </div>
  );
}
