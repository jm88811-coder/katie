import type { Distortion, ValueArea, MoodKey } from "./types";

export const MOODS: { key: MoodKey; label: string; emoji: string; score: number }[] = [
  { key: "great", label: "맑음", emoji: "☀️", score: 5 },
  { key: "good", label: "구름 조금", emoji: "🌤️", score: 4 },
  { key: "okay", label: "흐림", emoji: "☁️", score: 3 },
  { key: "low", label: "비", emoji: "🌧️", score: 2 },
  { key: "bad", label: "폭풍", emoji: "⛈️", score: 1 },
];

export const BODY_PARTS = ["머리", "목·어깨", "가슴", "배", "손발", "온몸"];

export const EMOTIONS = [
  "불안",
  "초조",
  "슬픔",
  "우울",
  "분노",
  "짜증",
  "수치심",
  "죄책감",
  "외로움",
  "무기력",
  "속상함",
  "두려움",
];

export const DISTORTIONS: Distortion[] = [
  {
    id: "all-or-nothing",
    name: "흑백논리",
    summary: "중간 없이 '완벽 아니면 실패'로 나누어 봐요.",
    question: "0과 100 사이에서 지금은 몇 점쯤일까요?",
    keywords: ["완벽", "전부", "하나도", "다 망", "아예", "완전히", "실패작", "쓸모없"],
  },
  {
    id: "catastrophizing",
    name: "파국화(재앙화)",
    summary: "최악의 결과가 반드시 일어날 것처럼 예측해요.",
    question: "가장 현실적인 결과는 무엇일까요? 최악이 와도 대처할 방법은요?",
    keywords: ["망할", "끝장", "큰일", "최악", "돌이킬 수", "인생 망", "어떡하", "어쩌지", "잘리"],
  },
  {
    id: "mind-reading",
    name: "마음 읽기",
    summary: "확인 없이 상대의 생각을 단정해요. 한국에서는 '눈치'로 자주 나타나요.",
    question: "상대가 그렇게 생각한다는 증거가 있나요? 직접 물어볼 수 있다면요?",
    keywords: ["날 싫어", "나를 싫어", "무시", "한심하게", "눈치", "뒷말", "욕할", "무능하다고", "이상하게 볼", "능력 없다고"],
  },
  {
    id: "should",
    name: "~해야만 해",
    summary: "스스로에게 엄격한 규칙을 강요해요.",
    question: "'해야 한다'를 '하고 싶다/하면 좋겠다'로 바꾸면 어떤 느낌인가요?",
    keywords: ["해야", "하지 말아야", "반드시", "무조건", "당연히", "안 되는"],
  },
  {
    id: "labeling",
    name: "낙인찍기",
    summary: "한 번의 사건으로 나를 '○○한 사람'이라 규정해요.",
    question: "이 행동 하나가 나 전체를 말해 줄까요? 친구라면 뭐라고 할까요?",
    keywords: ["나는 바보", "나는 무능", "나는 쓸모", "패배자", "실패자", "민폐", "나는 구제", "찐따", "못난"],
  },
  {
    id: "personalization",
    name: "자기 탓(개인화)",
    summary: "내가 통제할 수 없는 일까지 내 책임이라 느껴요.",
    question: "이 일에 영향을 준 다른 요인은 무엇일까요? (책임 파이로 나눠 보세요)",
    keywords: ["내 탓", "나 때문", "내가 망", "내 잘못", "제가 잘못", "내가 문제"],
  },
  {
    id: "overgeneralization",
    name: "과잉일반화",
    summary: "한 번의 경험을 '항상/절대'로 확대해요.",
    question: "'항상'이라고 했는데, 그렇지 않았던 때는 없었나요?",
    keywords: ["항상", "맨날", "늘 이래", "또 이래", "절대", "한 번도", "언제나", "매번", "역시나"],
  },
  {
    id: "emotional-reasoning",
    name: "감정적 추론",
    summary: "'그렇게 느껴지니까 사실이다'라고 믿어요.",
    question: "느낌과 사실을 나눠 적어 보면 무엇이 사실이고 무엇이 느낌인가요?",
    keywords: ["느낌이 들어", "느껴져", "그런 기분", "불길", "왠지"],
  },
  {
    id: "discounting",
    name: "긍정 깎아내리기",
    summary: "잘한 일은 '운'이나 '별것 아님'으로 치부해요.",
    question: "잘된 부분을 내 노력의 결과로 본다면 무엇이 보이나요?",
    keywords: ["운이 좋", "운 좋았", "별거 아", "누구나 하는", "어쩌다", "우연히", "그냥 얻어걸"],
  },
];

export const VALUE_AREAS: ValueArea[] = [
  { id: "career", label: "경력·일", emoji: "💼" },
  { id: "learning", label: "배움", emoji: "📚" },
  { id: "health", label: "건강", emoji: "🏃" },
  { id: "family", label: "부모·자녀", emoji: "👨‍👩‍👧" },
  { id: "partner", label: "연인·부부", emoji: "💞" },
  { id: "friends", label: "친구", emoji: "🤝" },
  { id: "leisure", label: "여가", emoji: "🎨" },
  { id: "community", label: "사회기여", emoji: "🌱" },
  { id: "spirit", label: "종교·영성", emoji: "🕊️" },
];

export const VALUE_SUGGESTIONS: Record<string, string[]> = {
  career: ["내 일에서 작은 성취 쌓기", "동료와 솔직하게 소통하기"],
  learning: ["하루 10분 읽기", "새로운 분야 하나 맛보기"],
  health: ["매일 20분 걷기", "잠자리에 일정한 시간에 들기"],
  family: ["가족에게 안부 전하기", "함께 밥 먹는 시간 만들기"],
  partner: ["하루 한 번 고마움 표현하기", "휴대폰 없이 대화하기"],
  friends: ["오래된 친구에게 먼저 연락하기", "만남 약속 잡기"],
  leisure: ["나를 위한 취미 시간 갖기", "산책하며 하늘 보기"],
  community: ["작은 기부나 봉사 해보기", "이웃에게 인사 건네기"],
  spirit: ["조용히 앉아 감사 떠올리기", "자연 속에서 시간 보내기"],
};

export interface MeditationProgram {
  id: string;
  title: string;
  emoji: string;
  description: string;
  /** 단계별 안내 문구 (초 단위 시작 시점) */
  script: { at: number; text: string }[];
  minutes: number;
  gradient: string;
}

export const MEDITATIONS: MeditationProgram[] = [
  {
    id: "river",
    title: "생각의 강",
    emoji: "🌊",
    description: "생각을 강물 위의 나뭇잎으로 보며 흘려보내요.",
    minutes: 3,
    gradient: "from-sky-200 to-emerald-100",
    script: [
      { at: 0, text: "편안한 자세로 앉아 숨을 세 번 깊게 쉬어요." },
      { at: 20, text: "강가에 앉아 있다고 상상해 보세요. 물이 천천히 흐릅니다." },
      { at: 50, text: "생각이 떠오르면 나뭇잎에 올려 강물에 띄워 보내요." },
      { at: 100, text: "생각을 밀어내지도, 따라가지도 않아요. 그저 흘러가는 걸 지켜봐요." },
      { at: 150, text: "다시 호흡으로 돌아와요. 지금 이 순간 숨이 들어오고 나갑니다." },
    ],
  },
  {
    id: "sky",
    title: "생각의 하늘",
    emoji: "☁️",
    description: "나는 하늘, 생각과 감정은 지나가는 구름이에요.",
    minutes: 3,
    gradient: "from-blue-200 to-sky-50",
    script: [
      { at: 0, text: "눈을 감고 넓은 하늘을 떠올려요." },
      { at: 25, text: "구름이 하나둘 지나가요. 생각과 감정도 구름처럼 오고 가요." },
      { at: 70, text: "하늘은 구름에 물들지 않아요. 나는 그 넓은 하늘이에요." },
      { at: 120, text: "구름이 짙어도 하늘은 그대로 있어요. 그 사실을 느껴 보세요." },
      { at: 160, text: "천천히 눈을 뜨며 지금 이곳으로 돌아와요." },
    ],
  },
  {
    id: "body",
    title: "몸 감각 스캔",
    emoji: "🧘",
    description: "머리부터 발끝까지 몸의 긴장을 알아차려요.",
    minutes: 4,
    gradient: "from-amber-100 to-rose-100",
    script: [
      { at: 0, text: "발끝에 주의를 두고 느껴지는 감각을 그대로 알아차려요." },
      { at: 45, text: "종아리, 무릎, 허벅지로 천천히 올라가요." },
      { at: 100, text: "배와 가슴. 호흡에 따라 움직임을 느껴 보세요." },
      { at: 155, text: "어깨와 목의 힘을 풀어요. 턱도 느슨하게." },
      { at: 205, text: "온몸을 한 번에 느끼며 마무리해요." },
    ],
  },
];

export const CRISIS_KEYWORDS = [
  "죽고 싶",
  "죽고싶",
  "자살",
  "목숨을 끊",
  "사라지고 싶",
  "사라지고싶",
  "살기 싫",
  "살고 싶지 않",
  "끝내고 싶",
  "자해",
  "죽어버리",
  "없어지고 싶",
];

export const HOTLINES = [
  { name: "자살예방상담전화", number: "109", note: "24시간 · 무료" },
  { name: "정신건강위기상담전화", number: "1577-0199", note: "24시간 · 무료" },
  { name: "청소년전화", number: "1388", note: "24시간 · 청소년 상담" },
  { name: "긴급 상황", number: "119", note: "즉시 도움이 필요할 때" },
];
