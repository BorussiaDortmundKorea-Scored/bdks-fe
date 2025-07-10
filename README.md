# 🏆 BDKS Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

**보루시아 도르트문트 코리아 팬카페 실시간 평점 시스템**

[🚀 시작하기](#-시작하기) • [📚 컴포넌트](#-컴포넌트) • [🔧 개발](#-개발) • [🤝 기여](#-기여)

</div>

---

## 📋 목차

- [🎯 프로젝트 소개](#-프로젝트-소개)
- [✨ 기능](#-기능)
- [🏗️ 기술 스택](#️-기술-스택)
- [🚀 시작하기](#-시작하기)
- [⚙️ 환경 변수](#️-환경-변수)
- [📚 컴포넌트](#-컴포넌트)
- [🔧 개발](#-개발)
- [🧪 테스트](#-테스트)
- [🚢 배포](#-배포)
- [🤝 기여](#-기여)

## 🎯 프로젝트 소개

BDKS Frontend는 보루시아 도르트문트 코리아 팬카페에서 사용할 실시간 평점 시스템입니다.
경기 중 선수들의 퍼포먼스를 실시간으로 평가하고 다른 팬들과 공유할 수 있습니다.

### 💡 특징

- **⚡ 빠른 빌드**: Vite 기반 개발 환경
- **🎨 일관된 UI**: TailwindCSS + YD-UI 컴포넌트
- **🔄 실시간 업데이트**: Supabase Realtime 기반 통신
- **🛡️ 타입 안전**: TypeScript로 작성
- **📱 반응형**: 모바일/데스크톱 지원

## ✨ 기능

| 기능                   | 상태 | 설명                        |
| ---------------------- | ---- | --------------------------- |
| 🔑 **사용자 인증**     | ✅   | Supabase Auth 기반 로그인   |
| 🏆 **스코어 대시보드** | 🚧   | 실시간 점수 및 랭킹 표시    |
| 💬 **실시간 알림**     | ✅   | Supabase Realtime 기반 알림 |
| 📊 **데이터 시각화**   | 🚧   | Chart.js 기반 차트          |
| 🎨 **디자인 시스템**   | ✅   | YD-UI 컴포넌트 라이브러리   |
| 📱 **PWA 지원**        | 🚧   | 오프라인 지원 및 앱 설치    |

## 🏗️ 기술 스택

### 🔧 **프레임워크**

- **[React](https://reactjs.org/)** `^19.1.0` - UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)** `^5.8.3` - 타입 시스템
- **[Vite](https://vitejs.dev/)** `^7.0.0` - 빌드 도구

### 🎨 **스타일링**

- **[TailwindCSS](https://tailwindcss.com/)** `^4.1.11` - CSS 프레임워크
- **[YD-UI](https://github.com/your-username/yd-ui)** `^0.0.0` - 커스텀 UI 컴포넌트
- **[Storybook](https://storybook.js.org/)** `^8.0.0` - 컴포넌트 문서화

### 🔄 **상태 관리**

- **[Zustand](https://github.com/pmndrs/zustand)** `^4.5.0` - 클라이언트 상태 관리
- **[React Query](https://tanstack.com/query)** `^5.0.0` - 서버 상태 관리
- **[Supabase](https://supabase.com/)** `^2.39.0` - 백엔드 서비스 및 실시간 통신

### 🧪 **개발 도구**

- **[Vitest](https://vitest.dev/)** `^1.0.0` - 테스트 프레임워크
- **[ESLint](https://eslint.org/)** `^9.29.0` - 코드 린팅
- **[Prettier](https://prettier.io/)** `^3.6.2` - 코드 포맷팅
- **[Husky](https://typicode.github.io/husky/)** `^8.0.0` - Git 훅

### 🚢 **배포**

- **[Vercel](https://vercel.com/)** - 배포 및 호스팅
- **[pnpm](https://pnpm.io/)** `^8.0.0` - 패키지 매니저

## 🚀 시작하기

### 📋 요구사항

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (권장)
- **Git**

### 💻 설치

```bash
# 레포지토리 클론
git clone https://github.com/your-username/bdks-fe-react.git
cd bdks-fe-react

# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env.dev
cp .env.example .env.prod

# 개발 서버 실행
pnpm dev:dev
```

http://localhost:5173 에서 확인할 수 있습니다.

## ⚙️ 환경 변수

### 📄 `.env.dev`

```bash
# 앱 설정
VITE_APP_NAME=BDKS Frontend
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Supabase 설정
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 개발 설정
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
```

### 📄 `.env.prod`

```bash
# 앱 설정
VITE_APP_NAME=BDKS Frontend
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Supabase 설정
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 프로덕션 설정
VITE_DEBUG_MODE=false
VITE_MOCK_API=false
```

## 📚 컴포넌트

### 🧩 주요 컴포넌트

```typescript
// 사용자 도메인 컴포넌트
import { LoginForm, SignupForm, UserProfile } from "@/domains/user/components";

// 팀 도메인 컴포넌트
import { TeamInfo, TeamPlayerList } from "@/domains/team/components";

// 선수 도메인 컴포넌트
import { PlayerCard, PlayerDetail } from "@/domains/player/components";

// 평점 도메인 컴포넌트
import { RatingInput, RatingChart } from "@/domains/rating/components";

// 경기 도메인 컴포넌트
import { MatchInfo, MatchResult } from "@/domains/match/components";

// 실시간 도메인 컴포넌트
import { NotificationCenter, LiveUpdates } from "@/domains/realtime/components";

// 공통 UI 컴포넌트
import { Button, Card, Modal, Toast } from "@/shared/components";

// 공통 레이아웃
import { MainLayout, Header, Sidebar } from "@/shared/layout";

// 라우터
import { AppRouter } from "@/shared/router";

// 프로바이더
import { AuthProvider, ThemeProvider } from "@/shared/providers";
```

### 📖 Storybook

```bash
# Storybook 실행
pnpm storybook

# Storybook 빌드
pnpm build-storybook
```

## 🔧 개발

### 📁 프로젝트 구조

```
src/
├── 📂 domains/          # 비즈니스 도메인별 모듈
│   ├── 👤 user/         # 사용자 도메인
│   │   ├── components/  # 로그인, 회원가입, 프로필
│   │   ├── api/         # 사용자 API
│   │   ├── hooks/       # 사용자 관련 훅
│   │   ├── types/       # 사용자 타입
│   │   └── assets/      # 사용자 도메인 전용 asset
│   │       ├── icons/   # 로그인 아이콘, 프로필 아이콘
│   │       └── images/  # 기본 프로필 이미지
│   ├── 👥 team/         # 팀 도메인
│   │   ├── components/  # 팀 정보, 팀 선수 목록
│   │   ├── api/         # 팀 API
│   │   ├── hooks/       # 팀 관련 훅
│   │   ├── types/       # 팀 타입
│   │   └── assets/      # 팀 도메인 전용 asset
│   │       ├── logos/   # 팀 로고들
│   │       └── badges/  # 팀 배지, 엠블럼
│   ├── 🏃 player/       # 선수 도메인
│   │   ├── components/  # 선수 카드, 선수 상세
│   │   ├── api/         # 선수 API
│   │   ├── hooks/       # 선수 관련 훅
│   │   ├── types/       # 선수 타입
│   │   └── assets/      # 선수 도메인 전용 asset
│   │       ├── photos/  # 선수 사진들
│   │       └── positions/ # 포지션 아이콘
│   ├── ⭐ rating/       # 평점 도메인
│   │   ├── components/  # 평점 입력, 평점 차트
│   │   ├── api/         # 평점 API
│   │   ├── hooks/       # 평점 관련 훅
│   │   ├── types/       # 평점 타입
│   │   └── assets/      # 평점 도메인 전용 asset
│   │       ├── stars/   # 별점 아이콘
│   │       └── charts/  # 차트 관련 이미지
│   ├── ⚽ match/        # 경기 도메인
│   │   ├── components/  # 경기 정보, 경기 결과
│   │   ├── api/         # 경기 API
│   │   ├── hooks/       # 경기 관련 훅
│   │   ├── types/       # 경기 타입
│   │   └── assets/      # 경기 도메인 전용 asset
│   │       ├── fields/  # 경기장 이미지
│   │       └── events/  # 경기 이벤트 아이콘
│   └── 🔄 realtime/     # 실시간 도메인
│       ├── components/  # 실시간 알림, 라이브 업데이트
│       ├── api/         # 실시간 API
│       ├── hooks/       # 실시간 훅
│       ├── types/       # 실시간 타입
│       └── assets/      # 실시간 도메인 전용 asset
│           └── animations/ # 실시간 애니메이션
├── 📂 shared/           # 공통 모듈
│   ├── 🎨 components/   # 공통 UI 컴포넌트
│   ├── 🏗️ layout/       # 공통 레이아웃
│   │   ├── Header.tsx   # 헤더 컴포넌트
│   │   ├── Sidebar.tsx  # 사이드바 컴포넌트
│   │   ├── Footer.tsx   # 푸터 컴포넌트
│   │   └── MainLayout.tsx # 메인 레이아웃
│   ├── 🔀 router/       # 라우팅 설정
│   │   ├── index.tsx    # 메인 라우터
│   │   ├── guards/      # 라우트 가드
│   │   └── types.ts     # 라우트 타입
│   ├── 🔌 providers/    # 전역 프로바이더
│   │   ├── AuthProvider.tsx # 인증 프로바이더
│   │   ├── ThemeProvider.tsx # 테마 프로바이더
│   │   └── QueryProvider.tsx # React Query 프로바이더
│   ├── 🎨 styles/       # 전역 스타일
│   │   ├── globals.css  # 전역 CSS
│   │   ├── variables.css # CSS 변수
│   │   └── themes/      # 테마 파일들
│   ├── 🔧 api/          # 공통 API (Supabase 클라이언트)
│   ├── 🪝 hooks/        # 공통 훅
│   ├── 🛠️ utils/        # 유틸리티
│   ├── 🏪 stores/       # 전역 상태 관리
│   ├── 📝 types/        # 공통 타입
│   └── 🎨 assets/       # 공통 asset
│       ├── icons/       # 공통 아이콘 (홈, 설정, 검색)
│       ├── images/      # 공통 이미지 (로고, 배경)
│       └── fonts/       # 폰트 파일
└── 📂 pages/            # 페이지 컴포넌트 (도메인 조합)
    ├── HomePage.tsx     # 홈페이지
    ├── TeamPage.tsx     # 팀 + 선수 + 평점 조합
    ├── PlayerDetailPage.tsx # 선수 + 평점 + 경기 조합
    ├── MatchPage.tsx    # 경기 + 선수 + 평점 조합
    └── RatingPage.tsx   # 평점 + 통계 조합
```

### 🛠️ 명령어

```bash
# 개발 서버 (개발 환경)
pnpm dev:dev

# 개발 서버 (프로덕션 환경)
pnpm dev:prod

# 빌드
pnpm build

# 프리뷰
pnpm preview

# 린팅
pnpm lint

# 포맷팅
pnpm format

# 테스트
pnpm test

# Storybook
pnpm storybook
```

### 🔄 Git 워크플로

#### 📝 브랜치 네이밍

```bash
bdks-[번호]-[타입]-[기능설명]

# 예시
bdks-001-feat-프로젝트초기설정
bdks-002-feat-로그인UI구현
bdks-003-feat-스코어대시보드
bdks-004-fix-반응형레이아웃
bdks-005-docs-컴포넌트문서
```

#### 🏷️ 타입

| 타입       | 설명             |
| ---------- | ---------------- |
| `feat`     | 새로운 기능      |
| `fix`      | 버그 수정        |
| `refactor` | 리팩토링         |
| `style`    | UI/UX 개선       |
| `docs`     | 문서 업데이트    |
| `test`     | 테스트 추가/수정 |
| `chore`    | 빌드/도구 설정   |

#### 🚀 개발 과정

```bash
# 새 브랜치 생성
git checkout -b bdks-017-feat-실시간알림

# 커밋
git commit -m "feat: 실시간 알림 컴포넌트 구현

- NotificationCenter 컴포넌트 추가
- Socket.IO 클라이언트 연결
- 토스트 알림 UI 구현
- 알림 상태 관리 추가"

# 푸시 및 PR
git push origin bdks-017-feat-실시간알림
```

## 🧪 테스트

### 🚀 테스트 실행

```bash
# 단위 테스트
pnpm test

# 감시 모드
pnpm test:watch

# 컴포넌트 테스트
pnpm test:ui

# 커버리지
pnpm test:coverage
```

### 📊 테스트 목표

- **단위 테스트**: 85% 이상 커버리지
- **컴포넌트 테스트**: 모든 UI 컴포넌트
- **E2E 테스트**: 주요 사용자 플로우

### 🧪 테스트 예시

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/domains/user/components/LoginForm'

test('로그인 폼 제출', async () => {
  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText('이메일'), {
    target: { value: 'test@example.com' }
  })
  fireEvent.change(screen.getByLabelText('비밀번호'), {
    target: { value: 'password123' }
  })

  fireEvent.click(screen.getByText('로그인'))

  expect(screen.getByText('로그인 중...')).toBeInTheDocument()
})
```

## 🚢 배포

### 🔧 Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 🌐 환경별 배포

- **개발**: `pnpm dev:dev` → 개발용 Supabase 프로젝트 사용
- **프로덕션**: `pnpm build` → 프로덕션용 Supabase 프로젝트 사용

## 🤝 기여

### 📝 기여 방법

1. Fork 후 브랜치 생성
2. 기능 개발 및 테스트
3. 컨벤션에 맞는 커밋
4. PR 생성 및 리뷰 요청

### 📋 PR 체크리스트

- [ ] 테스트 통과
- [ ] 린팅 통과
- [ ] 컴포넌트 문서 업데이트
- [ ] 변경사항 README 반영

### 💬 문의

- **이슈**: [GitHub Issues](https://github.com/your-username/bdks-fe-react/issues)
- **토론**: [GitHub Discussions](https://github.com/your-username/bdks-fe-react/discussions)
