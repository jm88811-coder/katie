// 부동산중개사무소 페이지에 표시되는 모든 정보입니다. (네이버 플레이스 정보 기준)
// 내용이 바뀌면 이 파일만 고치면 페이지 전체에 반영됩니다.

export const OFFICE = {
  name: "더샵엘리포레 부동산",
  fullName: "더샵엘리포레공인중개사사무소",
  tagline: "입주민과 동행하는 부동산",
  intro:
    "오산시 서동 더샵오산엘리포레 아파트 단지 내 상가 101호에 있는 더샵엘리포레 부동산입니다. 입주민의 재산을 소중하게 여기며, 더샵오산엘리포레 아파트의 값어치를 한층 업그레이드하겠습니다.",
  phone: "031-373-0005",
  mobile: "010-7660-3913",
  address: "경기도 오산시 서동 더샵오산엘리포레 단지 내 상가 101호",
  addressDetail: "아파트 주차장 입구 코너 101호",
  parking: "더샵엘리포레 아파트 상가 주차장 무료 이용 (101호 상가 바로 앞 주차 가능)",
  visitNote: "오시기 전 전화 주시면 예약해 드립니다.",
  mapUrl: "https://naver.me/Ge4hap2V",
  blogUrl: "https://blog.naver.com/hwang8924",
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

export const PROPERTY_TYPES = ["아파트", "분양권", "상가", "토지", "주택", "공장"];
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

export const BADGES = [
  "오랜 경력 중개사의 노하우와 전문적인 상담",
  "청년지원 동행부동산 가입회원 — 중개수수료 할인",
  "매물 접수 및 전화 문의 언제든 환영",
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
