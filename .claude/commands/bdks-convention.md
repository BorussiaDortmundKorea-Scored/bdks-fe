# BDKS-FE 개발 컨벤션

bdks-fe 프로젝트의 코드를 작성하거나 수정할 때 반드시 아래 컨벤션을 따르세요.

## Tech Stack

- React 19 + TypeScript 5.8 (strict mode)
- Vite 7 (빌드), pnpm (패키지 매니저)
- Tailwind CSS 4 + `@youngduck/yd-ui` 디자인 시스템
- React Query (TanStack Query) 5 + Zustand 5
- Supabase (RPC 기반 백엔드)
- GSAP 3 (애니메이션), Sentry (에러 트래킹), React GA4 (분석)
- Vitest + Testing Library + MSW + Storybook 9

## 프로젝트 구조

도메인 기반 아키텍처를 사용합니다:

```
src/
├── domains/{domain}/           # 도메인별 기능 모듈
│   ├── api/
│   │   ├── {domain}-api.ts            # API 함수 (Supabase RPC)
│   │   └── react-query-api/
│   │       ├── query-keys.ts          # 쿼리 키 상수
│   │       ├── use-get-*.tsx          # Query 훅
│   │       └── use-mutate-*.tsx       # Mutation 훅
│   ├── components/                    # 도메인 컴포넌트
│   ├── mocks/                         # MSW 핸들러
│   └── {domain}-page.tsx             # 페이지 컴포넌트
├── shared/                     # 공유 모듈
│   ├── api/        # API 클라이언트
│   ├── components/ # 재사용 컴포넌트
│   ├── constants/  # 상수 (routes 등)
│   ├── hooks/      # 커스텀 훅
│   ├── mocks/      # MSW 통합 핸들러
│   ├── pages/      # 공유 페이지 (404)
│   ├── provider/   # Context, 라우트 가드
│   ├── router/     # 라우터 설정
│   ├── style/      # 글로벌 CSS
│   ├── types/      # 타입 정의
│   └── utils/      # 유틸리티
```

## Path Aliases

```
@admin → src/domains/admin
@animals → src/domains/animals
@auth → src/domains/auth
@auth-profile → src/domains/auth/auth-profile
@dashboard → src/domains/dashboard
@matches → src/domains/matches
@players → src/domains/players
@shared → src/shared
```

## 네이밍 컨벤션

**파일/폴더**: kebab-case
- 페이지: `*-page.tsx` (예: `admin-competition-page.tsx`)
- API: `*-api.ts` (예: `admin-competition-api.ts`)
- Query 훅: `use-get-*.tsx` (예: `use-get-all-competitions.tsx`)
- Mutation 훅: `use-mutate-*.tsx`
- 쿼리 키: `*-query-key.ts` 또는 `*-query-keys.ts`
- 에러 폴백: `*-error-fallback.tsx`
- 스켈레톤: `*-skeleton.tsx`
- 모달: `*-modal.tsx`
- 테스트: `*.test.tsx`
- 스토리: `*.stories.tsx`

**코드 내부**:
- 컴포넌트: PascalCase (`AdminCompetition`)
- 상수: UPPER_SNAKE_CASE (`ADMIN_COMPETITION_QUERY_KEYS`)
- 변수/함수: camelCase (`handleDeleteCompetition`)
- Interface: `I` prefix (`ICompetition`, `IProfileEntity`)
- DB Entity 타입: `Entity` suffix (`ICompetitionEntity`)

## 컴포넌트 작성 패턴

컴포넌트 파일 내부는 `SECTION` 주석으로 영역을 구분합니다:

```tsx
/**
 * 작성자: [Author]
 * 기능: [Feature description]
 * 프로세스 설명: [Process details]
 */

import { useState } from 'react';
// 외부 라이브러리
// 도메인 임포트 (@admin, @auth 등)
// 공유 임포트 (@shared)

interface IComponentProps {
  // props 타입
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

## Import 순서 (Prettier 자동 정렬)

1. React 관련
2. 외부 라이브러리
3. `@admin/*` → `@animals/*` → `@auth/*` → `@auth-profile/*` → `@dashboard/*` → `@matches/*` → `@players/*`
4. `@shared/*`

그룹 간 빈 줄, 그룹 내 알파벳 정렬.

## API & Data Fetching 패턴

- Supabase **RPC 호출** 기반 (직접 테이블 쿼리 사용 X)
- `handleSupabaseApiResponse()` 유틸로 응답 처리 + Sentry 에러 캡처
- `useSuspenseQuery()` 사용하여 Suspense 통합
- `ReactQueryBoundary`로 Suspense + ErrorBoundary 래핑
- Query key는 도메인별 상수 파일에서 관리
- Mutation 후 `queryClient.invalidateQueries()`로 캐시 무효화

```tsx
// API 함수
export const fetchCompetitions = async () => {
  const response = await supabase.rpc('get_competitions');
  return handleSupabaseApiResponse(response, '대회 목록 조회 실패');
};

// Query 훅
export const useGetAllCompetitionsSuspense = () => {
  return useSuspenseQuery({
    queryKey: COMPETITION_QUERY_KEYS.all,
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
```

## 라우팅

- `src/shared/constants/routes.ts`에 경로 상수 정의
- 동적 경로 헬퍼: `createPlayerStatsPath()`, `createMatchRatingsPath()` 등
- 라우트 가드: `PublicRoute`, `AuthRoute`, `AuthProfileRoute`, `AdminRoute`

## 스타일링 규칙

- **Tailwind CSS** utility-first 접근
- `@youngduck/yd-ui` 디자인 토큰 클래스 우선 사용 (`bg-background-*`, `text-yds-*` 등)
- 커스텀 토큰은 `src/shared/style/root.css`의 `@theme`에서 정의
- 반응형: `xs` (320px), `sm` (375px), `md` (450px)
- CSS-in-JS 사용하지 않음
- 컴포넌트 작업 시 `/yd-ui` 스킬로 yd-ui 문서 참조

## UI 패턴

- **모달/토스트**: `@youngduck/yd-ui`의 `useOverlay()` 훅
- **에러 바운더리**: `ReactQueryBoundary` (Suspense + ErrorBoundary 통합)
- **스켈레톤 로딩**: 도메인별 `*-skeleton.tsx` 컴포넌트
- **SEO**: `CustomHelmet` 래퍼 (React Helmet Async)
- **페이지 전환**: GSAP 기반 `usePageTransition()` 훅
- **레이아웃**: `LayoutWithHeaderFooter` (고정 헤더/푸터)

## Export 패턴

- 컴포넌트: `export default Component`
- 훅/유틸: named export (`export function useGetAll...`)
- 상수: named export (`export const QUERY_KEYS = ...`)

## 코드 품질

- ESLint + Prettier (printWidth: 120, trailing comma)
- Husky + lint-staged: 커밋 전 자동 린트
- import 자동 정렬 (`@trivago/prettier-plugin-sort-imports`)
- Tailwind 클래스 자동 정렬 (`prettier-plugin-tailwindcss`)

## 새 도메인 기능 추가 시 체크리스트

1. `src/domains/{domain}/` 폴더 생성
2. API 함수 작성 (`api/{domain}-api.ts`)
3. Query Key 정의 (`api/react-query-api/query-keys.ts`)
4. Query/Mutation 훅 작성 (`api/react-query-api/use-get-*.tsx`, `use-mutate-*.tsx`)
5. 페이지 컴포넌트 (`{domain}-page.tsx`) + `CustomHelmet` SEO
6. `ReactQueryBoundary`로 Suspense/Error 래핑 + 스켈레톤 컴포넌트
7. 라우트 추가 (`shared/constants/routes.ts` + 라우터 설정)
8. MSW 핸들러 작성 (`mocks/{domain}-handler.ts`)
9. 필요 시 Storybook 스토리 작성
