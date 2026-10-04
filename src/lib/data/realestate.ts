// 부동산중개사무소 페이지에 표시되는 모든 정보입니다. (네이버 플레이스 정보 기준)
// 내용이 바뀌면 이 파일만 고치면 페이지 전체에 반영됩니다.

export const OFFICE = {
  name: "더샵엘리포레 부동산",
  fullName: "더샵엘리포레공인중개사사무소",
  tagline: "입주민과 동행하는 부동산",
  // 공인중개사법상 중개대상물 표시·광고 시 반드시 표시해야 하는 항목입니다. 채워 넣으면 페이지에 표시됩니다.
  representative: "", // 예: "홍길동"
  registrationNo: "", // 예: "41370-2021-00000"
  intro:
    "오산시 서동 더샵오산엘리포레 아파트 단지 내 상가 101호에 있는 더샵엘리포레 부동산입니다. 입주민의 재산을 소중하게 여기며, 더샵오산엘리포레 아파트의 값어치를 한층 업그레이드하겠습니다.",
  phone: "031-373-0005",
  mobile: "010-7660-3913",
  address: "경기 오산시 여들동로 26 상가코너 101호",
  addressDetail: "오산시 서동 더샵오산엘리포레 단지 내 상가, 아파트 주차장 입구 코너",
  parking: "더샵엘리포레 아파트 상가 주차장 무료 이용 (101호 상가 바로 앞 주차 가능)",
  visitNote: "오시기 전 전화 주시면 예약해 드립니다.",
  mapUrl: "https://naver.me/GM3jYKLC",
  blogUrl: "https://blog.naver.com/hwang8924",
  blogRssUrl: "https://rss.blog.naver.com/hwang8924.xml",
};

export const HIGHLIGHTS = [
  { k: "위치", v: "단지 내 상가 101호" },
  { k: "주차", v: "상가 주차장 무료" },
  { k: "중개수수료", v: "청년 할인" },
  { k: "상담", v: "언제든 전화 환영" },
];

export const COMPLEXES = [
  { name: "더샵오산엘리포레", note: "사무소가 위치한 단지 · 매매·전세·월세" },
  { name: "오산세교한양수자인", note: "매매·전세·월세" },
  { name: "세교중흥S클래스에듀파크", note: "매매·전세·월세" },
  { name: "오산세교우미린레이크", note: "분양권" },
];

export const PROPERTY_TYPES = ["아파트", "분양권", "상가", "토지", "주택", "공장"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const CATEGORIES: { type: PropertyType; desc: string }[] = [
  { type: "아파트", desc: "더샵오산엘리포레 등 서동·세교 단지 매매·전세·월세" },
  { type: "분양권", desc: "오산세교우미린레이크 등 분양권 매매·전매 상담" },
  { type: "상가", desc: "단지 내 상가·근린상가 임대와 매매" },
  { type: "토지", desc: "토지이용계획·허가구역 확인부터 매매까지" },
  { type: "주택", desc: "단독·다가구·빌라 매매와 임대" },
  { type: "공장", desc: "공장·창고 매매와 임대" },
];
export const DEAL_TYPES = ["매매", "전세", "월세"];

export const SERVICES = [
  {
    title: "매매·전세·월세 중개",
    body: "아파트·분양권·상가·토지·주택·공장까지, 찾으시는 매물을 신속하게 처리해 드립니다.",
  },
  {
    title: "전세자금대출 상담",
    body: "전세 계약과 함께 필요한 전세자금대출 진행을 상담해 드립니다.",
  },
  {
    title: "아파트담보대출 상담",
    body: "매매·잔금 일정에 맞춘 아파트 담보대출을 함께 알아봐 드립니다.",
  },
  {
    title: "양도세 상담",
    body: "매도 전 양도소득세를 미리 확인해 손해 없는 거래를 돕습니다.",
  },
];

export const AMENITIES = [
  "예약",
  "무선 인터넷",
  "남/녀 화장실 구분",
  "대기공간",
  "휠체어 출입 가능",
  "장애인 주차구역",
];

export const KEYWORDS = [
  "더샵엘리포레아파트",
  "오산아파트분양권",
  "오산지역주택조합아파트",
  "오산세교우미린레이크시티분양권",
  "오산서동부동산",
];

export const PHOTOS = [
  { src: "/realestate/storefront.jpg", alt: "더샵엘리포레 부동산 외관 간판" },
  { src: "/realestate/parking.jpg", alt: "사무소 앞 상가 주차장" },
  { src: "/realestate/interior-1.jpg", alt: "사무소 내부 상담 공간과 단지 배치도" },
  { src: "/realestate/interior-2.jpg", alt: "사무소 내부 상담 테이블" },
];

// 대표 매물. 공인중개사법상 인터넷 광고 시 아래 항목을 모두 표시해야 합니다.
// 실제 매물만 넣으세요. 비어 있으면 페이지에는 단지별 '매물 문의' 카드가 대신 표시됩니다.
export interface Listing {
  id: string;
  title: string;
  complex: string; // 단지명
  type: PropertyType; // 중개대상물 종류
  deal: "매매" | "전세" | "월세"; // 거래 형태
  price: string; // 가격 (월세는 "보증금 / 월세")
  address: string; // 소재지 (동·호수는 생략 가능)
  area: string; // 면적 (전용)
  floor: string; // 해당 층 / 총 층수
  approvalDate: string; // 사용승인일
  direction: string; // 방향
  rooms: string; // 방 / 욕실 개수
  moveIn: string; // 입주가능일
  parking: string; // 주차대수
  maintenanceFee: string; // 관리비
  photo?: string; // /public 아래 경로
  features?: string[];
}

export const LISTINGS: Listing[] = [];

// 고객 후기. 실제 고객 동의를 받은 후기만 넣으세요. 비어 있으면 네이버 리뷰 링크가 표시됩니다.
export const REVIEWS: { name: string; tag: string; body: string; date: string }[] = [];

export const AGENT = {
  // 대표 공인중개사 사진을 /public/realestate/agent.jpg 로 넣고 경로를 적으면 표시됩니다.
  photo: "",
  greeting:
    "언제든 전화 주시면 찾으시는 매물을 신속하게 처리해 드립니다. 입주민의 재산을 소중하게 여기는 동네 부동산이 되겠습니다.",
  strengths: [
    { title: "오랜 경력의 노하우", body: "지역 시세와 단지 사정을 잘 아는 중개사가 직접 상담합니다." },
    { title: "청년 중개수수료 할인", body: "청년지원 동행부동산 가입회원으로 중개수수료를 할인해 드립니다." },
    { title: "대출·세금까지 한 번에", body: "전세자금대출·아파트담보대출·양도세 상담을 함께 도와드립니다." },
  ],
};

export const REGION = {
  title: "오산 서동 · 세교 생활권",
  intro:
    "더샵오산엘리포레는 오산시 서동 여들동로에 있는 단지입니다. 세교 신도시와 맞닿은 생활권으로, 서동·세교 일대 아파트와 분양권 거래를 주로 중개합니다.",
  points: [
    { k: "규제", v: "비규제지역", note: "조정대상지역·투기과열지구 미지정 (2026년 10월 기준)" },
    { k: "대출", v: "수도권 주담대 최대 6억", note: "2025년 6월 28일 시행" },
    { k: "토지거래허가구역", v: "가수동·궐동·갈곶동 일원", note: "필지별 해당 여부는 토지이음에서 확인" },
  ],
};
