# Katie — 1인 사업가 비즈니스 매니저

1인 사업가를 위한 올인원 비즈니스 관리 웹앱입니다. 데이터는 Supabase(PostgreSQL) 클라우드 데이터베이스에 저장되며, 이메일/비밀번호 로그인으로 보호됩니다.

## 주요 기능

- **로그인/회원가입**: 이메일 인증 기반 계정, 각 사용자는 자신의 데이터만 조회 가능
- **대시보드**: 이번 달 수입/지출/순이익, 최근 6개월 추이 차트, 미수금, 할 일, 최근 문서 요약
- **매출·지출 관리**: 수입/지출 내역 기록, 월별 필터, 카테고리별 정리
- **견적서·청구서**: 품목 단위 견적서/청구서 작성, 부가세 자동 계산, 인쇄/PDF 저장
- **고객·거래처 관리(CRM)**: 거래처 정보와 거래 이력, 관련 문서 확인
- **할 일·일정 관리**: 우선순위·마감일이 있는 태스크 관리
- **설정**: 견적서/청구서에 표시될 사업자 정보(상호명, 사업자번호, 계좌 등) 관리

## Supabase 프로젝트 설정 (최초 1회)

1. [supabase.com](https://supabase.com)에서 무료 계정을 만들고 새 프로젝트를 생성합니다.
2. 프로젝트가 만들어지면 **SQL Editor**로 이동해 `supabase/schema.sql` 파일 내용 전체를 붙여넣고 실행합니다. (테이블, RLS 정책이 생성됩니다)
3. **Project Settings → API**에서 `Project URL`과 `anon public` 키를 복사합니다.
4. 프로젝트 루트에 `.env` 파일을 만들고 아래처럼 채웁니다 (`.env.example` 참고):

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

5. (선택) **Authentication → Providers → Email**에서 "Confirm email"을 끄면 가입 즉시 이메일 인증 없이 로그인할 수 있어 테스트가 편합니다.

## 개발

```bash
npm install
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run lint      # oxlint 실행
```

## 기술 스택

React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · Recharts · Supabase (Postgres + Auth)
