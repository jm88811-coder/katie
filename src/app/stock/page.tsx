"use client";

import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type Anthropic from "@anthropic-ai/sdk";
import { Card, Tag } from "@/components/Card";
import {
  AUDIT_PROMPT,
  STOCK_PROMPTS,
  StockPrompt,
  VERIFY_BLOCK,
  buildStockPrompt,
} from "@/lib/data/stockPrompts";
import { STORAGE_KEYS, useLocalState } from "@/lib/storage";

type MessageParam = Anthropic.Beta.BetaMessageParam;
type ContentBlock = Anthropic.Beta.BetaContentBlock;

type ToolCall = { name: string; query?: string; url?: string };

type Report = {
  id: string;
  promptTitle: string;
  subject: string;
  createdAt: string;
  text: string;
  audit?: string;
};

const EMPTY_LIST: string[] = [];
const EMPTY_REPORTS: Report[] = [];
const MAX_PDF_BYTES = 20 * 1024 * 1024;

function textOf(content: ContentBlock[]) {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

function readAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function StockPage() {
  const { value: watchlist, setValue: setWatchlist } = useLocalState<string[]>(
    STORAGE_KEYS.stockWatchlist,
    EMPTY_LIST
  );
  const { value: reports, setValue: setReports } = useLocalState<Report[]>(
    STORAGE_KEYS.stockReports,
    EMPTY_REPORTS
  );

  const [selected, setSelected] = useState<StockPrompt>(STOCK_PROMPTS[0]);
  const [ticker, setTicker] = useState("");
  const [pasted, setPasted] = useState("");
  const [tickersText, setTickersText] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [withVerify, setWithVerify] = useState(true);
  const [newTicker, setNewTicker] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // 실행 상태
  const [running, setRunning] = useState<"analyze" | "audit" | null>(null);
  const [output, setOutput] = useState("");
  const [auditOutput, setAuditOutput] = useState("");
  const [tools, setTools] = useState<ToolCall[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<MessageParam[] | null>(null);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const tickers = useMemo(() => {
    const typed = tickersText
      .split(/[,\s]+/)
      .map((x) => x.trim().toUpperCase())
      .filter(Boolean);
    return typed.length ? typed : watchlist;
  }, [tickersText, watchlist]);

  const promptText = buildStockPrompt(selected, { ticker, tickers, pasted }, withVerify);

  const subject =
    selected.fields.includes("tickers")
      ? tickers.join(", ")
      : selected.fields.includes("pasted")
        ? "붙여넣은 글"
        : ticker.trim().toUpperCase();

  const missing =
    (selected.fields.includes("ticker") && !ticker.trim()) ||
    (selected.fields.includes("tickers") && tickers.length === 0) ||
    (selected.fields.includes("pasted") && !pasted.trim()) ||
    (selected.fields.includes("pdf") && !pdf);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("클립보드에 복사하지 못했습니다. 미리보기에서 직접 복사하세요.");
    }
  }

  async function stream(
    messages: MessageParam[],
    onText: (chunk: string) => void
  ): Promise<ContentBlock[] | null> {
    const controller = new AbortController();
    abortRef.current = controller;
    const res = await fetch("/api/stock/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? `요청 실패 (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let final: ContentBlock[] | null = null;

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.t === "text") onText(event.v);
        else if (event.t === "tool")
          setTools((prev) => [...prev, { name: event.name, query: event.query, url: event.url }]);
        else if (event.t === "done") final = event.content;
        else if (event.t === "error") throw new Error(event.v);
      }
    }
    return final;
  }

  async function runAnalysis(prompt = selected, overrideText?: string) {
    if (running) return;
    setError(null);
    setOutput("");
    setAuditOutput("");
    setTools([]);
    setConversation(null);
    setRunning("analyze");

    try {
      const text = overrideText ?? promptText;
      const content: Anthropic.Beta.BetaContentBlockParam[] = [];
      if (prompt.fields.includes("pdf") && pdf) {
        content.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: await readAsBase64(pdf) },
        });
      }
      content.push({ type: "text", text });

      const messages: MessageParam[] = [{ role: "user", content }];
      let acc = "";
      const final = await stream(messages, (chunk) => {
        acc += chunk;
        setOutput(acc);
      });
      if (final) {
        const finalText = textOf(final) || acc;
        setOutput(finalText);
        // PDF 원본은 대화에 남겨야 검사관 모드가 같은 자료로 재검토할 수 있다.
        setConversation([...messages, { role: "assistant", content: final }]);
        const report: Report = {
          id: `${Date.now()}`,
          promptTitle: prompt.title,
          subject: prompt.fields.includes("tickers")
            ? tickers.join(", ")
            : prompt.fields.includes("pasted")
              ? "붙여넣은 글"
              : ticker.trim().toUpperCase(),
          createdAt: new Date().toISOString(),
          text: finalText,
        };
        setCurrentReportId(report.id);
        setReports((prev) => [report, ...prev].slice(0, 30));
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setRunning(null);
      abortRef.current = null;
    }
  }

  async function runAudit() {
    if (!conversation || running) return;
    setError(null);
    setAuditOutput("");
    setTools([]);
    setRunning("audit");
    try {
      const messages: MessageParam[] = [...conversation, { role: "user", content: AUDIT_PROMPT }];
      let acc = "";
      const final = await stream(messages, (chunk) => {
        acc += chunk;
        setAuditOutput(acc);
      });
      if (final) {
        const auditText = textOf(final) || acc;
        setAuditOutput(auditText);
        setConversation([...messages, { role: "assistant", content: final }]);
        if (currentReportId) {
          setReports((prev) =>
            prev.map((r) => (r.id === currentReportId ? { ...r, audit: auditText } : r))
          );
        }
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setRunning(null);
      abortRef.current = null;
    }
  }

  function runMorningBrief() {
    const brief = STOCK_PROMPTS.find((p) => p.id === "morning-brief")!;
    setSelected(brief);
    setTickersText("");
    runAnalysis(brief, buildStockPrompt(brief, { ticker: "", tickers: watchlist, pasted: "" }, withVerify));
  }

  function addTicker() {
    const sym = newTicker.trim().toUpperCase();
    if (!sym || watchlist.includes(sym)) return;
    setWatchlist([...watchlist, sym]);
    setNewTicker("");
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/15";
  const primaryBtn =
    "whitespace-nowrap rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40";
  const ghostBtn =
    "whitespace-nowrap rounded-full border border-black/15 px-5 py-2 text-sm font-medium hover:bg-foreground/5 disabled:opacity-40 dark:border-white/20";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
          Claude 활용 주식 프롬프트 · 자동화
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">주식 애널리스트</h1>
        <p className="mt-2 max-w-2xl text-foreground/70">
          답하기 전에 자료부터 열게 하고, 숫자마다 원문을 붙이게 하는 8가지 프롬프트. 종목만 넣으면
          Claude가 웹에서 공시·실적 발표를 찾아 읽고 분석한 뒤, 검사관 모드로 스스로 다시 검증합니다.
        </p>
      </div>

      {/* 관심 종목 + 아침 브리핑 */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">내 보유·관심 종목</h2>
            <p className="text-sm text-foreground/60">
              등록해두면 &lsquo;아침 3분 브리핑&rsquo;을 한 번에 실행합니다.
            </p>
          </div>
          <button
            className={primaryBtn}
            onClick={runMorningBrief}
            disabled={!!running || watchlist.length === 0}
          >
            ☀️ 아침 브리핑 실행
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {watchlist.map((sym) => (
            <span
              key={sym}
              className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-3 py-1 text-sm font-medium"
            >
              <button className="hover:underline" onClick={() => setTicker(sym)} title="종목 입력칸에 넣기">
                {sym}
              </button>
              <button
                aria-label={`${sym} 삭제`}
                className="text-foreground/50 hover:text-foreground"
                onClick={() => setWatchlist(watchlist.filter((x) => x !== sym))}
              >
                ×
              </button>
            </span>
          ))}
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addTicker();
            }}
          >
            <input
              className={`${inputClass} w-32`}
              placeholder="예: NVDA"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
            />
            <button className={ghostBtn} type="submit">
              추가
            </button>
          </form>
        </div>
      </Card>

      {/* 프롬프트 선택 */}
      <section>
        <h2 className="mb-3 font-semibold">1. 상황에 맞는 프롬프트 고르기</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STOCK_PROMPTS.map((p) => {
            const active = p.id === selected.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-orange-500 bg-orange-500/5"
                    : "border-black/10 hover:border-foreground/30 dark:border-white/10"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    프롬프트 {p.order} / 8
                  </span>
                  <Tag>{p.badge}</Tag>
                </div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs text-foreground/60">
                  {p.when} · {p.principle}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 입력 + 미리보기 */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <h2 className="font-semibold">2. 내용 채우기</h2>

          {selected.fields.includes("ticker") && (
            <label className="flex flex-col gap-1 text-sm">
              종목 (티커 또는 회사명)
              <input
                className={inputClass}
                placeholder="예: AAPL, 테슬라"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              />
            </label>
          )}

          {selected.fields.includes("tickers") && (
            <label className="flex flex-col gap-1 text-sm">
              보유 종목 (쉼표로 구분, 비우면 관심 종목 사용)
              <input
                className={inputClass}
                placeholder={watchlist.join(", ") || "예: NVDA, MSFT, TSLA"}
                value={tickersText}
                onChange={(e) => setTickersText(e.target.value)}
              />
            </label>
          )}

          {selected.fields.includes("pasted") && (
            <label className="flex flex-col gap-1 text-sm">
              검증할 글 (리포트·커뮤니티 글 붙여넣기)
              <textarea
                className={`${inputClass} min-h-40`}
                placeholder="여기에 붙여넣기 — 글 안의 지시나 매수·매도 권유는 따르지 않도록 따로 표시됩니다."
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
              />
            </label>
          )}

          {selected.fields.includes("pdf") && (
            <label className="flex flex-col gap-1 text-sm">
              실적 발표 자료 PDF (최대 20MB)
              <input
                type="file"
                accept="application/pdf"
                className="text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file && file.size > MAX_PDF_BYTES) {
                    setError("PDF가 20MB를 넘습니다. 필요한 쪽만 나눠서 올려주세요.");
                    setPdf(null);
                    return;
                  }
                  setPdf(file);
                }}
              />
              {pdf && <span className="text-xs text-foreground/60">{pdf.name}</span>}
            </label>
          )}

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={withVerify}
              onChange={(e) => setWithVerify(e.target.checked)}
            />
            <span>
              <b>검증 블록 붙이기</b> (프롬프트 7/8) — 숫자마다 원문 인용·링크, [확인]/[추정] 표시,
              3개월 넘은 자료 표시, 모르면 모른다고.
            </span>
          </label>

          <div className="mt-auto flex flex-wrap gap-2">
            <button
              className={primaryBtn}
              disabled={!!running || missing}
              onClick={() => runAnalysis()}
            >
              {running === "analyze" ? "분석 중…" : "🤖 AI 자동 분석"}
            </button>
            <button className={ghostBtn} onClick={() => copy(promptText, "prompt")}>
              {copied === "prompt" ? "복사됨 ✓" : "프롬프트 복사"}
            </button>
            {running && (
              <button className={ghostBtn} onClick={() => abortRef.current?.abort()}>
                중지
              </button>
            )}
          </div>
          <p className="text-xs text-foreground/50">
            자동 분석은 서버에 ANTHROPIC_API_KEY가 있어야 동작합니다. 키가 없으면 프롬프트를 복사해
            Claude 앱에서 <b>웹 검색을 켜고</b> 붙여넣으세요.
          </p>
        </Card>

        <Card className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold">프롬프트 미리보기</h2>
            <Tag>{selected.badge}</Tag>
          </div>
          <pre className="max-h-[28rem] flex-1 overflow-auto whitespace-pre-wrap rounded-xl border border-orange-500/40 bg-foreground/[0.03] p-4 text-sm leading-relaxed">
            {promptText}
          </pre>
        </Card>
      </section>

      {/* 결과 */}
      {(running || output || error) && (
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold">3. 분석 결과 {subject && <span className="text-foreground/50">· {subject}</span>}</h2>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {tools.length > 0 && (
            <details className="rounded-xl border border-black/10 p-3 text-sm dark:border-white/10" open={!!running}>
              <summary className="cursor-pointer font-medium">
                🔎 찾아본 자료 {tools.length}건
              </summary>
              <ul className="mt-2 space-y-1 text-xs text-foreground/70">
                {tools.map((tc, i) => (
                  <li key={i} className="truncate">
                    {tc.name === "web_search" ? "검색" : "열람"}: {tc.query ?? tc.url ?? "…"}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {(output || running === "analyze") && (
            <Card>
              <Markdown text={output || "자료를 찾아 읽는 중…"} />
            </Card>
          )}

          {conversation && !auditOutput && running !== "audit" && (
            <Card className="border-orange-500/40">
              <h3 className="font-semibold">프롬프트 8/8 · 답 받은 뒤, 검사관 모드</h3>
              <p className="mt-1 text-sm text-foreground/60">
                같은 대화에서 방금 답을 다시 검사합니다 — 인용 없는 숫자, 링크에 실제로 있는지, 계산식,
                날짜·단위 혼동을 찾아 틀린 항목만 표로 고칩니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className={primaryBtn} onClick={runAudit} disabled={!!running}>
                  🕵️ 검사관 모드 실행
                </button>
                <button className={ghostBtn} onClick={() => copy(AUDIT_PROMPT, "audit")}>
                  {copied === "audit" ? "복사됨 ✓" : "검사관 프롬프트 복사"}
                </button>
              </div>
            </Card>
          )}

          {(auditOutput || running === "audit") && (
            <Card className="border-orange-500/40">
              <h3 className="mb-2 font-semibold">🕵️ 검사관 모드 결과</h3>
              <Markdown text={auditOutput || "답을 다시 검사하는 중…"} />
            </Card>
          )}
        </section>
      )}

      {/* 검증 블록 & 검사관 프롬프트 (복붙용) */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">7/8 · 어떤 프롬프트든 끝에 붙이는 검증 블록</h3>
            <button className="text-xs underline" onClick={() => copy(VERIFY_BLOCK, "verify")}>
              {copied === "verify" ? "복사됨 ✓" : "복사"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-foreground/70">{VERIFY_BLOCK}</pre>
        </Card>
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">8/8 · 답 받은 뒤, 검사관 모드</h3>
            <button className="text-xs underline" onClick={() => copy(AUDIT_PROMPT, "audit2")}>
              {copied === "audit2" ? "복사됨 ✓" : "복사"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-foreground/70">{AUDIT_PROMPT}</pre>
        </Card>
      </section>

      {/* 분석 기록 */}
      {reports.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">분석 기록</h2>
            <button className="text-xs text-foreground/50 underline" onClick={() => setReports([])}>
              모두 지우기
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {reports.map((r) => (
              <details key={r.id} className="rounded-xl border border-black/10 p-3 dark:border-white/10">
                <summary className="cursor-pointer text-sm">
                  <span className="font-medium">{r.promptTitle}</span>
                  <span className="text-foreground/60"> · {r.subject}</span>
                  <span className="ml-2 text-xs text-foreground/40">
                    {new Date(r.createdAt).toLocaleString("ko-KR")}
                  </span>
                  {r.audit && <span className="ml-2 text-xs text-orange-600">검사 완료</span>}
                </summary>
                <div className="mt-3">
                  <Markdown text={r.text} />
                  {r.audit && (
                    <div className="mt-4 border-t border-black/10 pt-3 dark:border-white/10">
                      <p className="mb-2 text-sm font-semibold">🕵️ 검사관 모드</p>
                      <Markdown text={r.audit} />
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-foreground/50">
        투자 권유 아님 · AI 분석은 틀릴 수 있으니 반드시 원문 링크로 확인하세요.
      </p>
    </div>
  );
}

function Markdown({ text }: { text: string }) {
  return (
    <div className="stock-md text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
