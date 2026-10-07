import { InspirationItem } from "@/lib/types";

/**
 * 국내외 이슈·불편·불만을 정리해 스스로 사업 아이템을 발견하도록 돕는 시드 데이터.
 * 특정 뉴스 기사를 인용한 것이 아니라 2025~2026년 한국/글로벌에서 반복적으로 관찰되는
 * 구조적 트렌드/불편 테마를 정리한 것이며, 실제 아이템화 전에는 반드시 직접 시장 검증할 것.
 */
export const INSPIRATION_ITEMS: InspirationItem[] = [
  {
    id: "insp-aging",
    category: "고령화·시니어",
    title: "돌봄 공백과 시니어 재취업 수요",
    description:
      "1인 고령가구 증가로 돌봄·안부확인 서비스 수요는 느는데 인력은 부족하다. 동시에 은퇴 후에도 일하고 싶은 시니어의 재취업 채널은 부족하다.",
    relatedStepIds: ["stage2"],
    tags: ["고령화", "돌봄", "로컬"],
  },
  {
    id: "insp-solo-household",
    category: "1인가구",
    title: "소량·소용량 소비의 불편",
    description:
      "1인가구가 늘었지만 여전히 대용량 위주 구성(식재료, 생활용품, 가전)이 많아 '나눠 담기·소분'에 대한 불만이 반복된다.",
    relatedStepIds: ["stage2"],
    tags: ["1인가구", "소분", "리테일"],
  },
  {
    id: "insp-subscription-fatigue",
    category: "구독 피로",
    title: "구독 서비스 난립에 따른 '구독 피로'",
    description:
      "여러 구독을 관리하지 못해 해지 시점을 놓치거나 중복 결제되는 불만이 많다. 구독 통합관리/최적화에 대한 니즈가 존재한다.",
    relatedStepIds: ["stage2"],
    tags: ["구독", "핀테크", "관리도구"],
  },
  {
    id: "insp-ai-anxiety",
    category: "AI 전환기 불안",
    title: "AI로 인한 직무 대체 불안과 리스킬링 수요",
    description:
      "AI 도입 속도가 빨라지며 '내 업무가 대체될까' 불안이 커지는 동시에, 무엇을 어떻게 다시 배워야 할지 모르는 사람이 많다.",
    relatedStepIds: ["stage3", "stage2"],
    tags: ["AI", "리스킬링", "교육"],
  },
  {
    id: "insp-freelancer",
    category: "프리랜서·1인사업자 증가",
    title: "프리랜서 증가와 행정·세무 부담",
    description:
      "플랫폼 기반 프리랜서/1인사업자가 늘면서 세금 신고, 계약서 작성, 4대보험 처리에서 반복적으로 겪는 어려움이 큰 불만 포인트다.",
    relatedStepIds: ["stage3", "stage5"],
    tags: ["프리랜서", "세무", "행정자동화"],
  },
  {
    id: "insp-local-decline",
    category: "지방소멸",
    title: "지역 상권 공동화와 로컬 브랜드 기회",
    description:
      "수도권 집중으로 지방 상권은 위축되지만, 반대로 '로컬 브랜드'·'지역 특산물 재해석'에 대한 관심과 지원사업은 늘고 있다.",
    relatedStepIds: ["stage2"],
    tags: ["지방소멸", "로컬브랜드", "정부지원"],
  },
  {
    id: "insp-mental-health",
    category: "정신건강",
    title: "번아웃·정신건강 케어에 대한 낮은 접근성",
    description:
      "상담 비용·낙인 효과 때문에 필요한데도 정신건강 케어를 미루는 사람이 많다. 저비용·비대면·기록 기반 케어 니즈가 있다.",
    relatedStepIds: ["stage4"],
    tags: ["정신건강", "웰빙", "비대면케어"],
  },
  {
    id: "insp-childcare",
    category: "육아",
    title: "맞벌이 가정의 '육아 공백 시간대' 문제",
    description:
      "등하원 시간, 방학 기간 등 '틈새 돌봄 시간대'를 메워줄 신뢰 가능한 서비스가 부족하다는 불만이 반복된다.",
    relatedStepIds: ["stage2"],
    tags: ["육아", "돌봄", "매칭플랫폼"],
  },
  {
    id: "insp-packaging-waste",
    category: "환경",
    title: "배달·이커머스 포장 쓰레기 과다",
    description:
      "배달·새벽배송 증가로 과대포장·일회용품 사용에 대한 소비자 불만과 규제 압력이 동시에 커지고 있다.",
    relatedStepIds: ["stage2"],
    tags: ["환경", "ESG", "포장재"],
  },
  {
    id: "insp-secondhand",
    category: "중고·리커머스",
    title: "고물가 시대의 리셀·중고 거래 확대",
    description:
      "새 제품 가격 부담으로 중고 거래가 일상화됐지만, 신뢰(품질 확인·사기 방지) 문제는 여전히 큰 불만으로 남아있다.",
    relatedStepIds: ["stage2"],
    tags: ["중고", "리커머스", "신뢰"],
  },
  {
    id: "insp-pet",
    category: "반려동물",
    title: "반려동물 돌봄 공백과 의료비 부담",
    description:
      "반려가구 증가로 펫시터·펫헬스케어 수요는 느는데, 신뢰할 수 있는 서비스와 합리적 가격대의 선택지는 부족하다는 불만이 많다.",
    relatedStepIds: ["stage2"],
    tags: ["반려동물", "헬스케어", "매칭플랫폼"],
  },
  {
    id: "insp-info-overload",
    category: "정보 과잉",
    title: "정보는 넘치는데 '내 상황에 맞는' 큐레이션은 부족",
    description:
      "유튜브·SNS에 창업/재테크 정보가 넘치지만 정작 '내 상황(자본, 시간, 성향)에 맞는' 개인화된 가이드는 드물다는 불만이 크다.",
    relatedStepIds: ["stage3"],
    tags: ["정보과잉", "개인화", "AI코칭"],
  },
];

export function getInspirationByStepId(stepId: string): InspirationItem[] {
  return INSPIRATION_ITEMS.filter((i) => i.relatedStepIds.includes(stepId));
}
