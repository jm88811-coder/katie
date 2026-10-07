import {
  ANIMALS, BRANCHES_HANJA, ELEMENTS, STEMS_HANJA, analyze, daewoon, pillarHanja, pillarName,
  type BirthInput, type Pillar, type SajuChart,
} from "./core";
import { DAY_MASTER, godSummary } from "./content";
import { yearFortune } from "./fortune";
import {
  crisisCards, currentDaewoon, dayPicks, pickLenses, quarterRoadmap, retrospective, seasonMap, targetYear,
} from "./wisdom";

const pillar = (p: Pillar | null) => (p ? { name: pillarName(p), hanja: pillarHanja(p) } : null);

/** Claude에 전달하는 "계산된 사실" 묶음. 풀이 문장은 이 값만 근거로 써야 한다. */
export function buildFacts(chart: SajuChart, now: Date) {
  const an = analyze(chart);
  const year = targetYear(now);
  const yf = yearFortune(chart, an, year);
  const dw = daewoon(chart);
  const cur = currentDaewoon(chart, now);
  const season = seasonMap(chart, now).find((s) => s.current);
  const picks = dayPicks(chart, an, now, 90);
  const dm = DAY_MASTER[an.dm];

  return {
    today: now.toISOString().slice(0, 10),
    profile: {
      name: chart.input.name || null,
      gender: chart.input.gender === "M" ? "남" : "여",
      solarBirth: `${chart.solar.year}-${chart.solar.month}-${chart.solar.day}`,
      lunarBirth: chart.lunar ? `${chart.lunar.year}-${chart.lunar.leap ? "윤" : ""}${chart.lunar.month}-${chart.lunar.day}` : null,
      birthHourKnown: chart.input.hour !== null,
      zodiac: `${ANIMALS[chart.year.branch]}띠`,
    },
    pillars: { year: pillar(chart.year), month: pillar(chart.month), day: pillar(chart.day), hour: pillar(chart.hour) },
    dayMaster: { name: `${dm.title} (${STEMS_HANJA[an.dm]})`, image: dm.image, trait: dm.text },
    elements: {
      counts: Object.fromEntries(ELEMENTS.map((e, i) => [e, an.counts[i]])),
      strongest: ELEMENTS[an.strongest],
      weakest: ELEMENTS[an.weakest],
    },
    strength: { score: an.strength, label: an.strong ? "신강" : "신약" },
    yongsinCandidate: { element: ELEMENTS[an.yongsin], reason: an.yongsinReason },
    tenGodGroups: godSummary(an).map((g) => ({ name: g.title, score: g.count })),
    daewoon: {
      direction: dw.forward ? "순행" : "역행",
      startAge: dw.startAge,
      current: cur && { age: `${cur.startAge}~${cur.endAge}`, pillar: pillarName(cur.pillar), god: cur.god },
      currentSeason: season && { name: season.season.name, theme: season.season.theme, todo: season.season.todo, avoid: season.season.avoid },
      list: dw.list.map((d) => ({ age: `${d.startAge}~${d.endAge}`, pillar: `${pillarName(d.pillar)}(${STEMS_HANJA[d.pillar.stem]}${BRANCHES_HANJA[d.pillar.branch]})`, god: d.god })),
    },
    year: {
      year,
      pillar: pillarName(yf.yearPillar),
      god: yf.god,
      score: yf.score,
      summary: yf.summary,
      bestMonth: { month: yf.best.month, keyword: yf.best.keyword, score: yf.best.score },
      worstMonth: { month: yf.worst.month, keyword: yf.worst.keyword, score: yf.worst.score },
      quarters: quarterRoadmap(yf).map((q) => ({ label: q.label, months: q.months, score: q.score, headline: q.headline, todo: q.todo, avoid: q.avoid })),
    },
    crisisAndOpportunityCards: crisisCards(chart, an, yf, now).map((c) => ({
      kind: c.kind, title: c.title, signal: c.signal, commonMistake: c.mistake, flipActions: c.flip, evidence: c.evidence,
    })),
    philosophyLenses: pickLenses(chart, an, now).map((l) => ({ name: l.name, quote: l.quote, source: l.source, insight: l.insight, practice: l.practice, evidence: l.evidence })),
    retrospective: retrospective(chart, an, now).map((r) => ({ title: r.title, question: r.question, evidence: r.evidence })),
    next90Days: {
      goodDays: picks.good.slice(0, 6).map((p) => ({ date: p.label, score: p.score, pillar: p.pillar, god: p.god, note: p.relation })),
      cautionDays: picks.caution.slice(0, 6).map((p) => ({ date: p.label, score: p.score, pillar: p.pillar, god: p.god, note: p.relation, avoid: p.avoid })),
    },
  };
}

export type Facts = ReturnType<typeof buildFacts>;
export type { BirthInput };
