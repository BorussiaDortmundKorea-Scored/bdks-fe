# BDKS Frontend Convention Guide

## Tech Stack

- **Framework**: React 19 + TypeScript 5.8 (strict mode)
- **Build**: Vite 7
- **Styling**: Tailwind CSS 4 + `@youngduck/yd-ui` 디자인 시스템
- **State**: React Query (TanStack Query) 5 + Zustand 5
- **Backend**: Supabase (RPC 기반)
- **Animation**: GSAP 3 + @gsap/react
- **Error Tracking**: Sentry
- **Analytics**: React GA4
- **Testing**: Vitest + Testing Library + MSW + Storybook 9 + Playwright
- **Package Manager**: pnpm

## Project Structure

```
src/
├── domains/                    # 도메인별 기능 모듈
│   ├── admin/                 # 관리자 기능
│   ├── auth/                  # 인증 및 프로필 설정
│   ├── dashboard/             # 대시보드
│   ├── matches/               # 매치/경기 관련
│   └── players/               # 선수 통계
├── shared/                    # 공유 유틸리티, 컴포넌트
│   ├── api/                   # API 클라이언트 및 설정
│   ├── components/            # 재사용 UI 컴포넌트
│   ├── constants/             # 상수 (routes 등)
│   ├── hooks/                 # 커스텀 훅
│   ├── mocks/                 # MSW 목 핸들러
│   ├── pages/                 # 공유 페이지 (404 등)
│   ├── provider/              # Context 프로바이더, 라우트 가드
│   ├── router/                # 라우터 설정 및 GA4 트래킹
│   ├── style/                 # 글로벌 CSS, Tailwind 설정
│   ├── types/                 # TypeScript 타입 정의
│   └── utils/                 # 유틸리티 함수
```

### 도메인 내부 구조

```
domains/{domain}/
├── api/
│   ├── {domain}-api.ts                # API 함수
│   └── react-query-api/
│       ├── query-keys.ts              # 쿼리 키 상수
│       ├── use-get-*.tsx              # Query 훅
│       └── use-mutate-*.tsx           # Mutation 훅
├── components/                        # 도메인 컴포넌트
├── mocks/                             # MSW 핸들러
└── {domain}-page.tsx                  # 페이지 컴포넌트
```

## Path Aliases

```
@admin     → src/domains/admin
@animals   → src/domains/animals
@auth      → src/domains/auth
@auth-profile → src/domains/auth/auth-profile
@dashboard → src/domains/dashboard
@matches   → src/domains/matches
@players   → src/domains/players
@shared    → src/shared
```

## Naming Conventions

| 대상 | 규칙 | 예시 |
|------|------|------|
| 폴더/파일 | kebab-case | `admin-competition.tsx` |
| 페이지 컴포넌트 | `*-page.tsx` | `admin-competition-page.tsx` |
| API 파일 | `*-api.ts` | `admin-competition-api.ts` |
| Query 훅 | `use-get-*.tsx` | `use-get-all-competitions.tsx` |
| Mutation 훅 | `use-mutate-*.tsx` | `use-mutate-competition.tsx` |
| 쿼리 키 | `*-query-key.ts` | `competition-query-keys.ts` |
| 에러 폴백 | `*-error-fallback.tsx` | `match-error-fallback.tsx` |
| 스켈레톤 | `*-skeleton.tsx` | `player-list-skeleton.tsx` |
| 모달 | `*-modal.tsx` | `add-competition-modal.tsx` |
| 테스트 | `*.test.tsx` | `admin-competition.test.tsx` |
| 스토리 | `*.stories.tsx` | `button.stories.tsx` |
| 컴포넌트 이름 | PascalCase | `AdminCompetition` |
| 상수 | UPPER_SNAKE_CASE | `ADMIN_COMPETITION_QUERY_KEYS` |
| 변수/함수 | camelCase | `handleDeleteCompetition` |
| Interface | `I` prefix | `ICompetition`, `IProfileEntity` |
| DB Entity | `Entity` suffix | `ICompetitionEntity` |
| Props 타입 | `I` prefix | `IAdminCompetitionAddModal` |

## Component Structure

컴포넌트 파일 내부는 `SECTION` 주석으로 영역을 구분합니다:

```tsx
/**
 * 작성자: [Author]
 * 기능: [Feature description]
 * 프로세스 설명: [Process details]
 */

import { useState } from 'react';
// ... 외부 라이브러리
// ... 도메인 임포트 (@admin, @auth 등)
// ... 공유 임포트 (@shared)

interface IComponentProps {
  // props 타입 정의
}

const Component = ({ prop1, prop2 }: IComponentProps) => {
  //SECTION HOOK호출 영역
  const { data } = useSuspenseQuery();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [state, setState] = useState();
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleClick = () => {};
  //!SECTION 메서드 영역

  return (
    // JSX
  );
};

export default Component;
```

## Import Order (Prettier 자동 정렬)

```
1. React 관련
2. 외부 라이브러리
3. @admin/*
4. @animals/*
5. @auth/*
6. @auth-profile/*
7. @dashboard/*
8. @matches/*
9. @players/*
10. @shared/*
```

- 그룹 간 빈 줄로 구분
- 그룹 내 알파벳 정렬

## API & Data Fetching

- **Supabase RPC** 호출 기반 (직접 테이블 쿼리 X)
- `handleSupabaseApiResponse()` 유틸로 응답 처리 + Sentry 에러 캡처
- `useSuspenseQuery()` 사용하여 Suspense 통합
- `ReactQueryBoundary`로 Suspense + ErrorBoundary 래핑
- Query key는 도메인별 파일에서 상수로 관리
- Mutation 후 `queryClient.invalidateQueries()`로 캐시 무효화

```tsx
// API 함수 패턴
export const fetchCompetitions = async () => {
  const response = await supabase.rpc('get_competitions');
  return handleSupabaseApiResponse(response, '대회 목록 조회 실패');
};

// Query 훅 패턴
export const useGetAllCompetitionsSuspense = () => {
  return useSuspenseQuery({
    queryKey: COMPETITION_QUERY_KEYS.all,
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
```

## Routing

- `src/shared/constants/routes.ts`에 경로 상수 정의
- 동적 경로 헬퍼 함수: `createPlayerStatsPath()`, `createMatchRatingsPath()` 등
- 라우트 가드:
  - `PublicRoute` - 비인증 사용자 전용
  - `AuthRoute` - 인증 + 프로필 완료 사용자
  - `AuthProfileRoute` - 프로필 미설정 사용자
  - `AdminRoute` - 관리자 전용 (`profile.is_admin` 체크)

## Styling

- **Tailwind CSS** utility-first 접근
- `@youngduck/yd-ui` 디자인 토큰 클래스 우선 사용 (`bg-background-*`, `text-yds-*` 등)
- 커스텀 토큰은 `src/shared/style/root.css`의 `@theme`에서 정의
- 반응형 브레이크포인트: `xs` (320px), `sm` (375px), `md` (450px)
- CSS-in-JS 사용하지 않음

## UI Patterns

- **모달/토스트**: `@youngduck/yd-ui`의 `useOverlay()` 훅 사용
- **에러 바운더리**: `ReactQueryBoundary` (Suspense + ErrorBoundary 통합)
- **스켈레톤 로딩**: 각 도메인별 `*-skeleton.tsx` 컴포넌트
- **SEO**: `CustomHelmet` 래퍼 (React Helmet Async)
- **페이지 전환**: GSAP 기반 `usePageTransition()` 훅
- **레이아웃**: `LayoutWithHeaderFooter` (고정 헤더/푸터 + 스크롤 가능 콘텐츠)

## Export Pattern

- **컴포넌트**: `export default Component`
- **훅/유틸**: named export (`export function useGetAll...`)
- **상수**: named export (`export const QUERY_KEYS = ...`)

## Environment Variables

- `.env.dev`, `.env.prod` 파일 사용
- `import.meta.env.VITE_*` 접두어로 접근
- 주요 변수: Supabase URL/Key, GA4 ID, Sentry DSN, EmailJS 설정

## Scripts

```bash
pnpm dev              # 개발 서버
pnpm build:dev        # 개발 빌드
pnpm build:prod       # 프로덕션 빌드
pnpm lint             # ESLint 실행
pnpm lint:fix         # ESLint 자동 수정
pnpm type-check       # TypeScript 검증
pnpm test             # Vitest 테스트
pnpm test:watch       # 테스트 와치 모드
pnpm test:coverage    # 테스트 커버리지
pnpm storybook        # Storybook 실행
pnpm check            # 전체 검증 (lint + type-check + test + storybook build + dev build)
```

## Code Quality

- **ESLint** + **Prettier** (printWidth: 120, trailing comma)
- **Husky** + **lint-staged**: 커밋 전 자동 린트
- Prettier `@trivago/prettier-plugin-sort-imports`로 import 자동 정렬
- Prettier `prettier-plugin-tailwindcss`로 Tailwind 클래스 정렬

## Testing

- **Vitest** (jsdom 환경) + **Testing Library**
- **MSW**로 Supabase RPC 엔드포인트 모킹
- 도메인별 `mocks/` 폴더에 핸들러 정의
- `src/shared/mocks/handlers/handlers.ts`에서 핸들러 통합
- **Storybook**으로 컴포넌트 문서화 및 시각적 테스트
