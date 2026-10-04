import { OFFICE } from "@/lib/data/realestate";

export interface BlogPost {
  title: string;
  link: string;
  date: string;
  excerpt: string;
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };

function clean(raw: string) {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m])
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string) {
  const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? clean(m[1]) : "";
}

export function parseRss(xml: string, limit: number): BlogPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.slice(0, limit).map((item) => {
    const excerpt = tag(item, "description");
    const pub = new Date(tag(item, "pubDate"));
    return {
      title: tag(item, "title"),
      link: tag(item, "link").replace(/\?fromRss.*$/, ""),
      date: Number.isNaN(pub.getTime())
        ? ""
        : pub.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" }),
      excerpt: excerpt.length > 90 ? `${excerpt.slice(0, 90)}…` : excerpt,
    };
  });
}

// 네이버 블로그 RSS에서 최신 글을 가져옵니다. 1시간마다 갱신되며, 실패하면 빈 목록을 돌려줍니다.
export async function getBlogPosts(limit = 4): Promise<BlogPost[]> {
  try {
    const res = await fetch(OFFICE.blogRssUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    return parseRss(await res.text(), limit).filter((p) => p.title && p.link.startsWith("https://"));
  } catch {
    return [];
  }
}
