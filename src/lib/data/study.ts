import { StudyCategory } from "@/lib/types";

export const STUDY_CATEGORIES: StudyCategory[] = [
  {
    id: "mindset",
    title: "마인드셋 · 자의식",
    description: "사업가로서의 정체성과 의사결정 습관을 다진다.",
    topics: [
      { id: "m1", label: "자의식 해체와 정체성 전환", detail: "손실회피·인정욕구·완벽주의가 의사결정에 미치는 영향을 이해한다 (docs/역행자-사업가-전략수립.md 1~2장 참고)." },
      { id: "m2", label: "실패를 데이터화하는 회고법", detail: "감정이 아닌 데이터 기반으로 실행 일지를 남기는 방법을 익힌다." },
      { id: "m3", label: "의사결정 프레임워크", detail: "가역적/비가역적 결정을 구분하고 속도와 신중함의 균형을 맞추는 법." },
    ],
  },
  {
    id: "finance",
    title: "재무·회계 기초",
    description: "숫자를 읽고 현금흐름을 관리하는 힘을 기른다.",
    topics: [
      { id: "f1", label: "현금흐름표 읽는 법", detail: "손익계산서상 이익과 실제 현금 보유량의 차이를 이해한다." },
      { id: "f2", label: "단위경제성(Unit Economics)", detail: "고객 1명을 획득/유지하는 데 드는 비용과 LTV를 계산한다." },
      { id: "f3", label: "손익분기점(BEP) 계산", detail: "고정비/변동비 구조를 파악하고 최소 목표 매출을 설정한다." },
    ],
  },
  {
    id: "tax-legal",
    title: "세금·법률 실무",
    description: "사업 운영에 필요한 최소한의 세무·법률 지식을 익힌다.",
    topics: [
      { id: "tl1", label: "사업자등록과 과세유형", detail: "개인/법인, 간이/일반과세자의 차이와 선택 기준." },
      { id: "tl2", label: "부가세·종합소득세 기본 구조", detail: "신고 주기, 필요 증빙, 절세를 위한 준비 습관." },
      { id: "tl3", label: "계약서·지식재산권 기초", detail: "표준 근로/용역 계약서 작성법과 상표·특허 보호의 기본." },
    ],
  },
  {
    id: "marketing",
    title: "마케팅 · 브랜딩",
    description: "고객에게 선택받는 이유를 설계한다.",
    topics: [
      { id: "mk1", label: "포지셔닝과 타겟 고객 정의", detail: "누구의 어떤 문제를 해결하는지 한 문장으로 정의한다." },
      { id: "mk2", label: "콘텐츠 마케팅 기초", detail: "채널별(블로그/숏폼/커뮤니티) 콘텐츠 전략 수립법." },
      { id: "mk3", label: "브랜드 아이덴티티 설계", detail: "톤앤매너, 비주얼, 메시지의 일관성을 만드는 법." },
    ],
  },
  {
    id: "sales-copy",
    title: "세일즈 · 카피라이팅",
    description: "설득의 심리와 전환을 만드는 글쓰기를 익힌다.",
    topics: [
      { id: "sc1", label: "설득의 심리 원리", detail: "손실회피, 사회적 증거, 희소성 등 구매 결정에 영향을 주는 원리." },
      { id: "sc2", label: "퍼널 설계", detail: "인지 → 관심 → 전환 → 재구매 단계별 메시지 설계." },
      { id: "sc3", label: "세일즈 카피 구조", detail: "문제 제기 → 공감 → 해결책 제시 → 행동 유도(CTA) 구조 연습." },
    ],
  },
  {
    id: "data-ai",
    title: "데이터 · AI 활용",
    description: "AI 도구로 혼자서도 여러 직무를 수행하는 능력을 기른다.",
    topics: [
      { id: "da1", label: "AI 업무 자동화 기초", detail: "반복 업무(고객응대, 콘텐츠 초안, 데이터 정리)를 AI로 자동화하는 법." },
      { id: "da2", label: "프롬프트 설계", detail: "목적에 맞는 결과를 얻기 위한 지시문 작성 패턴." },
      { id: "da3", label: "데이터 기반 의사결정", detail: "전환율, 리텐션 등 핵심 지표를 추적하고 해석하는 법." },
    ],
  },
  {
    id: "leadership",
    title: "조직관리 · 리더십",
    description: "혼자에서 팀으로 확장할 때 필요한 역량을 준비한다.",
    topics: [
      { id: "l1", label: "SOP(표준운영절차) 문서화", detail: "업무를 매뉴얼화해서 위임 가능한 형태로 만드는 법." },
      { id: "l2", label: "채용과 온보딩 기초", detail: "첫 직원/파트너를 뽑을 때 확인해야 할 체크리스트." },
      { id: "l3", label: "피드백과 동기부여", detail: "팀원의 성향(MBTI 등)에 맞춘 커뮤니케이션 방식." },
    ],
  },
  {
    id: "research",
    title: "트렌드 리서치 방법론",
    description: "이슈·불편·불만에서 사업 아이템을 발굴하는 방법을 익힌다.",
    topics: [
      { id: "r1", label: "불편·불만 관찰법", detail: "커뮤니티, 리뷰, 민원 데이터에서 반복되는 불만을 수집하는 법 (영감 노트 탭 활용)." },
      { id: "r2", label: "시장 검증 방법", detail: "설문이 아니라 실제 결제/예약으로 수요를 검증하는 법." },
      { id: "r3", label: "경쟁사 분석 프레임", detail: "가격, 채널, 고객 리뷰를 기준으로 경쟁사를 구조적으로 분석하는 법." },
    ],
  },
];
