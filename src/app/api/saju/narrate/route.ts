import Anthropic from "@anthropic-ai/sdk";
import { buildChart, type BirthInput } from "@/lib/saju/core";
import { buildFacts } from "@/lib/saju/facts";
import { MOCK_REPORT, SYSTEM_PROMPT, buildUserContent, sanitizeName } from "@/lib/saju/narrate";

export const runtime = "nodejs";
export const maxDuration = 120;

// 프로덕션 기본 모델. 비용을 줄이려면 SAJU_AI_MODEL=claude-sonnet-5-5 로 바꿀 수 있다.
const MODEL = process.env.SAJU_AI_MODEL || "claude-opus-5-5";
const PER_IP_PER_HOUR = Number(process.env.SAJU_AI_PER_IP_HOUR ?? 3);
const DAILY_CAP = Number(process.env.SAJU_AI_DAILY_CAP ?? 200);

// 서버리스에서는 인스턴스별 best-effort 제한이다. 트래픽이 늘면 Upstash/KV 등 공유 저장소로 교체할 것.
const ipHits = new Map<string, number[]>();
const daily = { day: "", count: 0 };

const REFUSED = "\n\n[[REFUSED]]";
const FAILED = "\n\n[[ERROR]]";

function json(status: number, error: string) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function parseBirth(body: unknown): BirthInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const int = (v: unknown, lo: number, hi: number) =>
    typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi ? v : null;
  const year = int(b.year, 1900, 2100), month = int(b.month, 1, 12), day = int(b.day, 1, 31);
  if (year === null || month === null || day === null) return null;
  const hour = b.hour === null ? null : int(b.hour, 0, 23);
  const minute = int(b.minute ?? 0, 0, 59);
  if ((b.hour !== null && hour === null) || minute === null) return null;
  if (b.gender !== "M" && b.gender !== "F") return null;
  if (b.calendar !== "solar" && b.calendar !== "lunar") return null;
  return {
    year, month, day, hour, minute,
    gender: b.gender, calendar: b.calendar,
    leap: b.leap === true && b.calendar === "lunar",
    trueSolar: b.trueSolar === true,
    name: sanitizeName(b.name),
  };
}

function limited(ip: string): string | null {
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  if (daily.day !== today) { daily.day = today; daily.count = 0; }
  if (daily.count >= DAILY_CAP) return "오늘 제공할 수 있는 AI 풀이가 모두 소진되었습니다. 내일 다시 찾아주세요.";
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  if (hits.length >= PER_IP_PER_HOUR) return "요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.";
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 5000) for (const [k, v] of ipHits) if (!v.some((t) => now - t < 3600_000)) ipHits.delete(k);
  daily.count++;
  return null;
}

export async function POST(request: Request) {
  // 같은 출처에서 온 요청만 허용 (다른 사이트가 우리 키로 풀이를 뽑는 것을 막는다)
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json(403, "forbidden");

  const mock = process.env.SAJU_AI_MOCK === "1" && process.env.NODE_ENV !== "production";
  if (!mock && !process.env.ANTHROPIC_API_KEY) return json(503, "not_configured");

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 2000) return json(413, "too_large");
    body = JSON.parse(text);
  } catch {
    return json(400, "invalid_json");
  }
  const birth = parseBirth(body);
  const chart = birth && buildChart(birth);
  if (!birth || !chart) return json(400, "invalid_birth");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const blocked = limited(ip);
  if (blocked) return json(429, blocked);

  const encoder = new TextEncoder();
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" };

  if (mock) {
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of MOCK_REPORT.match(/[\s\S]{1,24}/g) ?? []) {
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 25));
        }
        controller.close();
      },
    });
    return new Response(stream, { headers });
  }

  const facts = buildFacts(chart, new Date());
  const client = new Anthropic();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (s: string) => controller.enqueue(encoder.encode(s));
      try {
        const claude = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 16000,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "medium" },
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: buildUserContent(facts) }],
          },
          { signal: request.signal }
        );
        for await (const event of claude) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") send(event.delta.text);
        }
        const final = await claude.finalMessage();
        if (final.stop_reason === "refusal") send(REFUSED);
        else if (final.stop_reason === "max_tokens") send(FAILED);
      } catch (err) {
        if (!request.signal.aborted) {
          console.error("saju narrate failed:", err instanceof Error ? err.message : err);
          send(FAILED);
        }
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers });
}
