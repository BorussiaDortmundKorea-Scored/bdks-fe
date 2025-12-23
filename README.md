
<img width="1020" height="835" alt="bdks" src="https://github.com/user-attachments/assets/a34be8d9-678d-4e1c-bb70-6924661983f2" />

# 보돌코 스코어드

YD-UI 디자인 시스템 기반 보루시아 도르트문트 팬들을 위한 실시간 평점 커뮤니티

## 기술 스택

- **프레임워크**: React 19.1.0, TypeScript 5.8.3
- **빌드 도구**: Vite 7.0.0, SWC
- **스타일링**: Tailwind CSS 4.1.11, @youngduck/yd-ui 0.9.1
- **상태 관리**: React Query 5.81.5, Zustand 5.0.6
- **백엔드**: Supabase 2.50.3 (Auth, Database, Realtime)
- **라우팅**: React Router 7.6.3
- **애니메이션**: GSAP 3.13.0
- **차트**: Chart.js 4.5.1
- **모니터링**: Sentry 10.20.0
- **문서화**: Storybook 9.0.16, Chromatic 13.3.4
- **테스트**: Vitest 3.2.4, MSW 2.10.3, Testing Library
- **코드 품질**: ESLint 9.29.0, Prettier 3.6.2, Husky 9.1.7

## 주요 특징

- **도메인 기반 아키텍처**: 기능별로 모듈화된 구조 (auth, admin, matches, players, dashboard)
- **실시간 평점 시스템**: Supabase Realtime 기반 실시간 평점 입력 및 업데이트
- **권한 기반 라우팅**: PublicRoute, AuthRoute, AdminRoute로 접근 제어
- **타입 안전성**: TypeScript로 전체 코드베이스 타입 정의
- **YD-UI 컴포넌트**: 일관된 디자인 시스템 적용
- **에러 처리**: React Error Boundary와 Suspense 기반 에러/로딩 처리
- **MSW 기반 모킹**: 개발 환경에서 API 모킹 지원
- **반응형 디자인**: 모바일/데스크톱 지원

## 주요 기능

### 사용자 기능
- **인증**: 카카오 로그인, 익명 로그인
- **대시보드**: 선수 목록, 최근 경기 정보
- **실시간 평점**: 경기 중 선수별 실시간 평점 입력 및 조회
- **경기 히스토리**: 과거 경기 평점 조회 및 통계

### 관리자 기능
- **대시보드**: 사용자 수, 경기 통계 시각화
- **선수 관리**: 선수 CRUD 기능
- **경기 관리**: 경기 생성, 수정, 삭제 및 라인업 관리
- **팀 관리**: 팀 정보 관리
- **대회 관리**: 대회 정보 관리
- **사용자 관리**: 사용자 조회 및 탈퇴 처리
