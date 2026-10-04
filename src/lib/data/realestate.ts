// 부동산중개사무소 페이지에 표시되는 모든 정보입니다.
// 실제 사무소 정보(상호·대표·등록번호·연락처·주소)로 이 파일만 바꾸면 페이지 전체에 반영됩니다.

export const OFFICE = {
  name: "케이티 공인중개사사무소",
  tagline: "우리 동네 집, 처음부터 끝까지 책임지고 중개합니다",
  representative: "대표 공인중개사 홍길동",
  registrationNo: "등록번호 00000-0000-00000",
  phone: "02-000-0000",
  mobile: "010-0000-0000",
  email: "office@example.com",
  address: "서울특별시 ○○구 ○○로 00, 1층",
  hours: [
    { day: "평일", time: "09:30 – 19:00" },
    { day: "토요일", time: "10:00 – 17:00" },
    { day: "일·공휴일", time: "예약 상담" },
  ],
  mapUrl: "https://naver.me/Ge4hap2V",
  kakaoUrl: "",
};

export type DealType = "매매" | "전세" | "월세";
export type PropertyType = "아파트" | "오피스텔" | "빌라" | "상가" | "원룸";

export interface Listing {
  id: string;
  title: string;
  deal: DealType;
  property: PropertyType;
  price: string;
  area: string;
  floor: string;
  location: string;
  features: string[];
  isNew?: boolean;
}

export const LISTINGS: Listing[] = [
  {
    id: "L1",
    title: "역세권 남향 30평대 아파트",
    deal: "매매",
    property: "아파트",
    price: "9억 5,000만",
    area: "전용 84㎡",
    floor: "12/20층",
    location: "○○동",
    features: ["남향", "역 도보 5분", "올수리"],
    isNew: true,
  },
  {
    id: "L2",
    title: "신혼부부 추천 투룸 전세",
    deal: "전세",
    property: "빌라",
    price: "2억 8,000만",
    area: "전용 49㎡",
    floor: "3/4층",
    location: "○○동",
    features: ["주차 가능", "전세대출 가능"],
  },
  {
    id: "L3",
    title: "풀옵션 오피스텔",
    deal: "월세",
    property: "오피스텔",
    price: "1,000 / 75",
    area: "전용 26㎡",
    floor: "8/15층",
    location: "○○역 인근",
    features: ["풀옵션", "관리비 8만", "즉시 입주"],
    isNew: true,
  },
  {
    id: "L4",
    title: "대단지 아파트 전세",
    deal: "전세",
    property: "아파트",
    price: "5억 2,000만",
    area: "전용 59㎡",
    floor: "7/25층",
    location: "○○동",
    features: ["초품아", "대단지", "학원가"],
  },
  {
    id: "L5",
    title: "대로변 1층 상가",
    deal: "월세",
    property: "상가",
    price: "5,000 / 280",
    area: "전용 66㎡",
    floor: "1/5층",
    location: "○○로 대로변",
    features: ["유동인구 많음", "권리금 협의"],
  },
  {
    id: "L6",
    title: "역 근처 깔끔한 원룸",
    deal: "월세",
    property: "원룸",
    price: "500 / 55",
    area: "전용 20㎡",
    floor: "2/4층",
    location: "○○역 도보 7분",
    features: ["채광 좋음", "반려동물 협의"],
  },
];

export const SERVICES = [
  {
    title: "매매 중개",
    body: "실거래가·시세 분석을 바탕으로 적정 가격을 제안하고, 계약부터 잔금·등기까지 함께합니다.",
  },
  {
    title: "전·월세 임대차",
    body: "등기부등본·선순위 권리를 꼼꼼히 확인해 전세사기 걱정 없는 안전한 계약을 돕습니다.",
  },
  {
    title: "상가·사무실",
    body: "업종·상권 분석과 권리금, 용도 확인까지 창업과 이전에 필요한 정보를 드립니다.",
  },
  {
    title: "매물 접수·관리",
    body: "집을 내놓으시면 사진 촬영과 광고, 임차인 관리까지 빠르고 투명하게 진행합니다.",
  },
];

export const PROCESS = [
  { step: "01", title: "상담", body: "원하는 조건과 예산을 듣습니다." },
  { step: "02", title: "매물 추천·방문", body: "조건에 맞는 매물을 골라 함께 둘러봅니다." },
  { step: "03", title: "권리 분석", body: "등기부·건축물대장·세금 체납 여부를 확인합니다." },
  { step: "04", title: "계약·잔금", body: "특약 작성부터 잔금·입주까지 동행합니다." },
];

export const REVIEWS = [
  { name: "김○○ 님", tag: "아파트 매매", body: "시세 설명이 정확했고, 잔금일까지 일정을 챙겨주셔서 안심했어요." },
  { name: "이○○ 님", tag: "전세 계약", body: "등기부등본을 하나하나 설명해주셔서 처음 하는 전세 계약도 걱정 없었습니다." },
  { name: "박○○ 님", tag: "상가 임대", body: "상권 분석 자료까지 준비해주셔서 가게 자리를 빠르게 결정했어요." },
];
