import { Card } from "@/components/Card";

const BENCHMARKS = [
  {
    name: "Rocky.ai",
    point:
      "매일 성찰 질문과 저널링으로 성장 마인드셋·리더십을 코칭하는 AI 앱. 감정/기분 추적과 대화형 코칭이 강점.",
    gap: "일반적인 라이프/리더십 코칭에 가깝고, 세금·법률 등 창업 실무나 아이템 발굴 기능은 없음.",
  },
  {
    name: "VeltoAI",
    point:
      "매일 아침 3가지 구체적 태스크를 제시하고, 하루의 실행 결과를 학습해 다음 태스크를 조정하는 AI 비즈니스 코치.",
    gap: "일일 태스크 관리에 집중되어 있고, 온보딩 시 개인 서사(실패/성공담)를 깊이 반영하지는 않음.",
  },
  {
    name: "Mindsera",
    point:
      "창업가/고성과자를 위한 저널링 앱으로, AI가 사고 패턴을 분석해 피드백을 제공.",
    gap: "저널링·자기분석에 특화되어 있고, 단계별 커리큘럼(7단계 여정)이나 실무 체크리스트는 없음.",
  },
  {
    name: "모두의 창업 프로젝트 · K-Startup류 멘토링 플랫폼",
    point:
      "정부·기관 주도의 창업 인큐베이팅, 선배 창업가 멘토링, 업종별 AI 솔루션 추천을 제공.",
    gap: "기관 심사·지원사업 연계에 강하지만, 개인화된 '매일의 코칭 동반자' 경험은 제공하지 않음.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">파운더스토리 소개</h1>
        <p className="mt-2 text-foreground/70">
          이름, 생년월일, MBTI/성향, 실패담과 성공담, 지향점·목적·목표를 입력받아 &mdash; 마치
          사주를 보듯 &mdash; 나만의 사업가 원형을 진단하고, 자체 개발한 7단계 사업가 성장 프레임을
          챕터로 풀어 Step 1부터 사업가로 성장하도록 이끄는 코칭 앱입니다.
        </p>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">기획 배경 &amp; 벤치마킹</h2>
        <p className="mb-4 text-sm text-foreground/70">
          유사 서비스를 조사한 결과, &lsquo;AI 코칭&rsquo; 카테고리는 이미 존재하지만 각각 강점과
          공백이 있었습니다. 파운더스토리는 아래 공백(개인 서사 기반 개인화 + 단계별 커리큘럼 +
          한국 창업 실무)을 채우는 방향으로 설계했습니다.
        </p>
        <div className="flex flex-col gap-3">
          {BENCHMARKS.map((b) => (
            <div key={b.name} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
              <h3 className="font-semibold">{b.name}</h3>
              <p className="mt-1 text-sm text-foreground/70">{b.point}</p>
              <p className="mt-1 text-sm text-foreground/50">빈틈: {b.gap}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">차별화 포인트</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/70">
          <li>사주식 온보딩: 이름·생년월일시·MBTI·실패/성공담·지향점을 한 번에 입력받아 &lsquo;사업가 원형&rsquo;으로 진단</li>
          <li>영화 같은 7단계 여정: 챕터별 요약, 핵심 포인트, 실행 과제, 코치 질문, 진행률</li>
          <li>영감 노트: 국내외 이슈·불편·불만 큐레이션으로 스스로 아이템을 발견하도록 유도</li>
          <li>세금·법률 체크리스트: 예비창업자 → 등록 직후 → 운영 중 → 확장기까지 단계별 실무 안내</li>
          <li>스터디 카테고리: 마인드셋부터 데이터/AI 활용까지 8개 분야 학습 로드맵</li>
          <li>AI 시대 신직업: 사업 아이템이나 커리어 전환의 힌트가 되는 신직업군 소개</li>
          <li>고민상담: 막히는 순간마다 관련 챕터와 실행 조언을 즉시 연결</li>
        </ul>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">다음 단계 (로드맵)</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/70">
          <li>현재는 로컬 저장(브라우저) 기반 MVP입니다. 계정/서버 저장, 기기 간 동기화 추가 예정</li>
          <li>개인화 엔진을 실제 LLM(예: Claude API) 연동으로 고도화해 더 정교한 스토리 분석 제공</li>
          <li>세금/법률 정보는 국세청 공식 API·최신 세법 연동으로 신뢰도 강화</li>
          <li>커뮤니티(동료 창업가 매칭), 실제 전문가(세무사/변호사) 연결 기능 검토</li>
        </ul>
      </Card>

      <p className="text-xs text-foreground/40">
        벤치마킹 내용은 2026년 9월 기준 공개 정보를 요약한 것으로, 각 서비스의 실제 기능은
        변경될 수 있습니다.
      </p>
    </div>
  );
}
