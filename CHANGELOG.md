# Changelog

이 문서는 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) 형식을 기반으로 작성되었으며,
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) 규칙을 준수합니다.

### 🚧 진행 예정

- 매치 (최근 경기) 도메인 제작
- 매치 (실시간 경기) 도메인 제작
- auth (닉네임 설정) 도메인 제작
- 선수 (평점 입력) 도메인 제작

### 📋 버전 관리 정책 (v0.6.1부터 적용)

- **Major**: 메이저 버전 (1.0.0 → 2.0.0) - 실제 서비스 격변
- **Feature**: 마이너 버전 (0.6.0 → 0.7.0)
- **Refactor/Fix**: 패치 버전 (0.6.1 → 0.6.2)

## [0.6.1] - 2025-08-14

### ✅ 작업 내용

- [x] **문서화**: 0.0.6 버전 작업내용 문서 업데이트
- [x] **Fix**: Storybook 폴더 경로명 수정
- [x] **Refactor**: 시간단위 상수 모듈화
- [x] **Refactor**: 쿼리클라이언트 모듈화
- [x] **Fix**: 로그아웃 시 캐싱 초기화

### 🎯 요약

코드 품질 개선 및 버그 수정

## [0.0.6] - 2025-08-14

### ✅ 작업 내용

- [x] **대시보드 페이지** 개방
- [x] **선수 DB 컴포넌트** 구현 (가로 스크롤 형태의 선수 카드 목록)
- [x] **Player DB API** 구현 (Supabase RPC 연동)
- [x] **React Query 훅** 구현 (`useGetPlayerDBWithMyRatings`)
- [x] **에러 처리 및 스켈레톤** 컴포넌트 구현
- [x] **lucide-react** 아이콘 라이브러리 추가
- [x] **@testing-library/user-event** 테스팅 라이브러리 추가
- [x] **Storybook 경로 매핑** 추가 (`@dashboard/*`)

### 🎯 요약

대시보드 기능 구현 및 선수 데이터 표시 기능 완성

## [0.0.4] - 2025-07-25

- [x] **strict mode** 제거
- [x] **선수단, 포지션** 테이블 제작, 정책 부여
- [x] **선수단** 이미지 storage 등록
- [x] **profile** 테이블 제작: supabase에서 제공하는 auth.users을 fk로 엮어서 제작
- [x] **닉네임설정페이지** 초안 제작

## [0.0.1] - 2025-07-10

### ✅ 작업 내용

- [x] **Tailwind V4** 설치
- [x] **Zustand** 설치
- [x] **React Query V5** 설치
- [x] **Favicon 적용**, **title 태그** 변경
- [x] **Vercel 배포** 설정
- [x] **Husky** 설치
- [x] **Storybook V9** 설치
- [x] **Vitest** 설치
- [x] **MSW V2** 설치
- [x] **Prettier, ESLint** 설정
- [x] **README.md** 수정
- [x] **React Router DOM** 라우터 세팅
- [x] **Changelog.md** 생성
- [x] **Cursor Rules** 추가

### 🎯 요약

프로젝트 초기 환경 구성 및 개발 도구 설정 완료
