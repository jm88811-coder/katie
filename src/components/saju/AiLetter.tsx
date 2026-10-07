"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { BirthInput } from "@/lib/saju/core";
import { useLocalState } from "@/lib/storage";
import { Card } from "./ui";
import { Dodlyeong } from "./motion";

type Status = "idle" | "loading" | "error";

const cacheKey = (b: BirthInput) => {
  const d = new Date();
  const k = [b.year, b.month, b.day, b.hour, b.minute, b.gender, b.calendar, b.leap, b.trueSolar, b.name].join("|");
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (Math.imul(31, h) + k.charCodeAt(i)) | 0;
  return `saju:ai:${(h >>> 0).toString(36)}:${d.getFullYear()}-${d.getMonth() + 1}`;
};

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((t, i) =>
        t.startsWith("**") && t.endsWith("**") ? <b key={i}>{t.slice(2, -2)}</b> : <Fragment key={i}>{t}</Fragment>
      )}
    </>
  );
}

/** 마크다운(제목·목록·문단)만 안전하게 렌더링 — HTML은 해석하지 않는다 */
function Letter({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) blocks.push(<ul key={`l${blocks.length}`} className="my-2 list-disc space-y-1 pl-5">{list.map((x, i) => <li key={i}><Inline text={x} /></li>)}</ul>);
    list = [];
  };
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) { flush(); blocks.push(<h3 key={`h${blocks.length}`} className="serif mt-6 text-lg font-bold text-[var(--seal)] first:mt-0">{line.slice(3)}</h3>); }
    else if (line.startsWith("- ")) list.push(line.slice(2));
    else if (line.trim() === "") flush();
    else { flush(); blocks.push(<p key={`p${blocks.length}`} className="mt-2 text-sm leading-relaxed"><Inline text={line} /></p>); }
  }
  flush();
  return <div>{blocks}</div>;
}

const ERRORS: Record<string, string> = {
  not_configured: "AI 풀이는 아직 준비 중입니다. 곧 열릴 예정이니 위의 계산 기반 풀이를 먼저 확인해 주세요.",
};

export function AiLetter({ birth }: { birth: BirthInput }) {
  const key = cacheKey(birth);
  const { value: saved, setValue: save } = useLocalState<string>(key, "");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [live, setLive] = useState("");
  const [msg, setMsg] = useState("");
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  async function run() {
    abort.current?.abort();
    const ctl = new AbortController();
    abort.current = ctl;
    setStatus("loading"); setLive(""); setMsg("");
    try {
      const res = await fetch("/api/saju/narrate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(birth), signal: ctl.signal,
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "" }));
        setMsg(ERRORS[err.error] ?? (typeof err.error === "string" && err.error ? err.error : "풀이를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."));
        return setStatus("error");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setLive(acc.replace(/\[\[(REFUSED|ERROR)\]\]/g, ""));
      }
      if (acc.includes("[[REFUSED]]")) { setMsg("이 풀이는 안전 정책상 생성되지 않았습니다. 계산 기반 풀이를 참고해 주세요."); return setStatus("error"); }
      if (acc.includes("[[ERROR]]")) { setMsg("풀이 생성이 중간에 끊겼습니다. 잠시 후 다시 시도해 주세요."); return setStatus("error"); }
      save(acc.trim());
      setLive("");
      setStatus("idle");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setMsg("네트워크 오류가 발생했습니다."); setStatus("error");
    }
  }

  const text = saved || live;
  return (
    <Card>
      <div className="mb-3 flex items-center gap-3">
        <Dodlyeong mood={status === "loading" ? "think" : saved ? "smile" : "idle"} size={64} />
        <div>
          <h3 className="serif text-lg font-bold">달도령의 편지 <span className="rounded-full border border-[var(--line)] px-2 py-0.5 align-middle text-[10px] font-normal text-[var(--ink-soft)]">AI 작성</span></h3>
          <p className="text-xs text-[var(--ink-soft)]">위 계산값을 바탕으로 Claude가 한 통의 편지로 풀어 드립니다. 이번 달 한 번 받으면 이 기기에 저장됩니다.</p>
        </div>
      </div>

      {text && <Letter text={text} />}
      {status === "loading" && <p className="mt-3 text-xs text-[var(--ink-soft)]" aria-live="polite">달도령이 붓을 들었습니다… 1~2분쯤 걸릴 수 있어요.</p>}
      {status === "error" && <p role="alert" className="mt-3 text-sm text-[var(--seal)]">{msg}</p>}

      {!saved && status !== "loading" && (
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <label className="flex items-start gap-2 text-xs text-[var(--ink-soft)]">
            <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>풀이를 만들기 위해 생년월일시·성별·이름과 계산값이 Anthropic API로 전송되는 데 동의합니다. 우리 서버에는 저장하지 않습니다.</span>
          </label>
          <button
            disabled={!consent}
            onClick={run}
            className="rounded-xl bg-[var(--seal)] px-5 py-3 font-semibold text-[var(--on-seal)] disabled:opacity-40"
          >
            AI 풀이 받기 (무료)
          </button>
        </div>
      )}
      {saved && <p className="mt-4 text-xs text-[var(--ink-soft)]">이번 달 풀이는 이 기기에 저장되어 있습니다. 다음 달에 새 편지를 받을 수 있어요.</p>}
    </Card>
  );
}
