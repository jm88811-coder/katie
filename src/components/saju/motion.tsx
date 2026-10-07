"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

// ───────── 스크롤 진입 fade-up ─────────
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ───────── 점수 카운트업 ─────────
export function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    if (reduce) return void mv.set(value);
    if (inView) {
      const c = animate(mv, value, { duration: 1.1, ease: "easeOut" });
      return () => c.stop();
    }
  }, [inView, value, reduce, mv]);
  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}

// ───────── 말풍선(타이핑) ─────────
export function Speech({ text, className = "" }: { text: string; className?: string }) {
  // text가 바뀌면 타이핑을 처음부터 다시 시작하도록 key로 초기화
  return <TypedSpeech key={text} text={text} className={className} />;
}

function TypedSpeech({ text, className }: { text: string; className: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setN((x) => (x >= text.length ? (clearInterval(id), x) : x + 2)), 28);
    return () => clearInterval(id);
  }, [text, reduce]);
  const shown = reduce ? text : text.slice(0, n);
  return (
    <div className={`relative rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-sm leading-relaxed ${className}`} aria-label={text}>
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{text}</span>
    </div>
  );
}

// ───────── 달도령 (임시 SVG 캐릭터. 일러스트/Rive 교체 시 이 컴포넌트만 바꾸면 됨) ─────────
export type Mood = "idle" | "think" | "smile" | "divine";

export function Dodlyeong({ mood = "idle", size = 96 }: { mood?: Mood; size?: number }) {
  const reduce = useReducedMotion();
  const eyes: Record<Mood, ReactNode> = {
    idle: <><circle cx="42" cy="58" r="3" /><circle cx="68" cy="58" r="3" /></>,
    think: <><path d="M38 58h8M64 58h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></>,
    smile: <><path d="M38 60q4-6 8 0M64 60q4-6 8 0" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></>,
    divine: <><circle cx="42" cy="58" r="4.5" /><circle cx="68" cy="58" r="4.5" /><circle cx="43.5" cy="56.5" r="1.4" fill="#fff" /><circle cx="69.5" cy="56.5" r="1.4" fill="#fff" /></>,
  };
  const mouth: Record<Mood, string> = {
    idle: "M48 74q7 4 14 0", think: "M50 76h10", smile: "M46 72q9 10 18 0", divine: "M51 74q4 5 8 0",
  };
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 110 110" role="img" aria-label="달도령 캐릭터" className="text-[var(--ink)]"
      animate={reduce ? undefined : { y: [0, -4, 0] }}
      transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* 달 */}
      <circle cx="86" cy="22" r="13" fill="#f2d98a" opacity="0.9" />
      <circle cx="91" cy="19" r="11" fill="var(--paper)" />
      {/* 갓 */}
      <ellipse cx="55" cy="32" rx="38" ry="7" fill="#1f1b16" />
      <path d="M36 32q0-20 19-20t19 20z" fill="#2b2620" />
      <path d="M36 32h38" stroke="#b8342b" strokeWidth="3" />
      {/* 얼굴 */}
      <ellipse cx="55" cy="62" rx="26" ry="24" fill="#f7e3c8" stroke="#1f1b16" strokeWidth="2" />
      <g fill="#1f1b16">{eyes[mood]}</g>
      <path d={mouth[mood]} stroke="#1f1b16" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="68" r="4" fill="#e89c8a" opacity="0.5" /><circle cx="74" cy="68" r="4" fill="#e89c8a" opacity="0.5" />
      {/* 도포 */}
      <path d="M30 88q25 12 50 0l8 22H22z" fill="#2f5d62" />
      <path d="M55 88v22" stroke="#f1e9da" strokeWidth="2" />
    </motion.svg>
  );
}

export function DodlyeongSays({ mood = "idle", text }: { mood?: Mood; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0"><Dodlyeong mood={mood} size={84} /></div>
      <Speech text={text} className="flex-1" />
    </div>
  );
}

// ───────── 서사형 챕터 / 스크롤 진행 바 ─────────
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-[var(--seal)]"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
    />
  );
}

export function Chapter({ no, kicker, title, children }: { no: number; kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-16 first:mt-6" aria-labelledby={`ch-${no}`}>
      <Reveal>
        <div className="mb-5">
          <div className="text-xs tracking-widest text-[var(--seal)]">제 {no} 장 · {kicker}</div>
          <h2 id={`ch-${no}`} className="serif mt-2 text-2xl font-bold leading-snug sm:text-3xl">{title}</h2>
          <div className="mt-3 h-px w-12 bg-[var(--seal)]" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}
