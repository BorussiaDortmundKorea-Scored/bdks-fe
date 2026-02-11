# Changelog

이 문서는 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) 형식을 기반으로 작성되었으며,
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) 규칙을 준수합니다.

## [1.5.6] - 2026-02-11

**Branch**: `bdks-v1.5.6-관리자대시보드리팩토링`

### 추가
- docs: v1.5.6작업내용문서

### 변경
- refactor: 사이트모음 중앙집중화

### 수정


### 제거

---
## [1.5.5] - 2026-02-11

**Branch**: `bdks-v1.5.5-관리자대시보드유저유형분석기능추가`

### 추가
- feat: 유저유형분석대시보드추가
- docs: v1.5.5작업내용문서

### 변경
- style: 파이차트 라벨 크기조정

### 수정


### 제거

---

## [1.5.4] - 2026-02-06

**Branch**: `bdks-v1.5.4-내정보페이지기능개발`

### 추가
- feat: 내정보페이지 기능 추가
- feat: 내정보 페이지 추가
- feat: 네비게이터 메뉴이동 팩토리패턴으로 제작
- feat: dashboard페이지 아래네비게이션바추가


### 변경
- refactor: 불필요한console제거

### 수정


### 제거

---
## [1.5.3] - 2026-01-12

**Branch**: `bdks-v1.5.3-관리자기능편의성개선`

### 추가

- feat: 커밋시 pr 자동 changelog 등록기능 추가
- feat: 관리자페이지 스타팅명단 일괄추가기능

### 변경

- chore: 자동화스크립트추가
- test: 관리자페이지 테스트코드추가

### 수정

- fix: yd-ui table미반영화면적용

### 제거

---

## [1.5.2] - 2026-01-05

**Branch**: `bdks-v1.5.2-관리자기능수정`

### 추가

- feat: 개발관련 관리사이트 바로가기 컴포넌트 추가
- feat: YD-UI Overlays 컴포넌트 사용을위한 APP에 provider감싸기

### 변경

- chore: YD-UI v0.11.1 버전업그레이드
- refactor: 관리자에서사용한기존모달YD-UI모달로전수교체
- refactor: 관리자에서사용하는스켈레톤YD-UI테이블로전수교체

### 수정

- fix: 경기시간 한국시간으로 유틸함수 만들어서 수정
- refactor: React.FC대신 props를 사용하도록 개선
- fix: 관리자 리팩토링후 모달사이즈조정

### 제거

---

## [1.5.1] - 2025-12-23 ~ 2025-12-26

**Branch**: `bdks-v1.5.1-선수DB기능추가`

### 추가

- feat: 선수 DB 조회화면 기초 작업 (도메인 폴더 세팅, 선수정보RPC연결)
- feat: 선수 DB 선수별 경기정보리스트 조회 RPC연결 및 와이어프레임작업

### 변경

- refactor: 로그아웃버튼 터치범위 개선
- refactor: navigate함수 모듈화된 소스코드 미적용 되어있는 화면들 적용

### 수정

- style: 라이브경기 선수이미지 height,width 220px -> 300px

### 제거

---

## [1.4.5] - 2025-12-23

**Branch**: `bdks-v1.4.5-css수정사항적용`

### 추가

### 변경

### 수정

- fix: 뒤로가기버튼 absolute 속성 제거 -> v1.4.2에서 메뉴버튼 relative 속성추가해주면서 생긴 이슈
- fix: 관리자페이지 차트 대시보드 모바일 height길이 지정 -> 모바일에서 차트가 너무작아서 안보임

### 제거

---

## [1.4.4] - 2025-12-19

**Branch**: `bdks-v1.4.4-yd-ui테이블컴포넌트일괄적용`

### 추가

### 변경

- refactor: 테이블 사용컴포넌트들 일괄 yd-ui의 테이블컴포넌트로 교체

### 수정

- fix: yd-ui 0.9.1버전 토큰값 변경으로인한 게이지 컴포넌트 css수정

### 제거

---

## [1.4.3] - 2025-12-18

**Branch**: `bdks-v1.4.3-관리자페이지선수교체한방쿼리제작`

### 추가

- feat: 경기중 선수교체발생시 API두번 일일히 호출해주던것 한방에호출하는방식으로 개선

### 변경

### 수정

### 제거

---

## [1.4.2] - 2025-12-18

**Branch**: `bdks-v1.4.2-관리자페이지이동권한및이동방식추가`

### 추가

- feat: 대시보드페이지 헤더 단일로그아웃버튼에서 메뉴버튼으로 전환
- feat: 관리자페이지들 admin-route 프로바이더를 통한 검증절차 추가

### 변경

### 수정

### 제거

---

## [1.4.1] - 2025-12-17

**Branch**: `bdks-v1.4.1-관리자페이지반응형제작`

### 추가

### 변경

### 수정

- refactor: 관리자페이지 반응형 처리

### 제거

---

## [1.3.2] - 2025-12-11

**Branch**: `bdks-v1.3.2-수파베이스MCP연결`

### 추가

- feat: supabase mcp연결

### 변경

### 수정

### 제거

- refactor: db스키마를 수기로 적어놓은 cursor rule 제거 (mcp를 활용하면됨)

---

## [1.3.1] - 2025-11-19

**Branch**: `bdks-v1.3.1-크로마틱연결`

### 추가

- 크로마틱 라이브러리 설치 및 연동작업

### 변경

- vercel 배포 파이프라인에 node_modules, pnpm-lock.yaml 삭제후 재설치 과정 추가

### 수정

### 제거

---

## [1.2.4] - 2025-11-18

**Branch**: `bdks-v1.2.4-YD-UI-토큰재설계변경사항적용`

### 추가

### 변경

- 버튼 컴포넌트 디자인 토큰 값 수정

### 수정

- 어드민 페이지 text-yds-xx와 font신라체 스타일 충돌 이슈 해결

### 제거

- axios api통신 관련코드들 제거 -> supabase rpc기반으로 통신하므로
- animal(테스트도메인) 관련 코드들 제거

---

## [1.2.3] - 2025-11-06

**Branch**: `bdks-v1.2.3-Sentry-고도화`

### 추가

- supabase rpc 에러 응답시 400번대 에러 Sentry에 안잡혀서 인위적으로 capture후 전송하는 util함수`handleSupabaseApiResponse`제작

### 변경

- 세션리플레이 기능 마스킹처리 해제
- api호출 부분 일괄적으로 `handleSupabaseApiResponse` 함수 등록

### 수정

- vercel 배포시 [vite-plugin-sitemap] ENOENT: no such file or directory, open '/vercel/path0/dist/robots.txt' 에러가 발생하여 vite.config에 robot.txt generate값 false로 수정 및 robot.txt파일 public폴더에 추가제공

### 제거

- axios api통신 관련코드들 제거 -> supabase rpc기반으로 통신하므로
- animal(테스트도메인) 관련 코드들 제거

---

## [1.2.2] - 2025-10-25

### ✅ 작업 내용

- [x] **Chore**: 차트 라이브러리 chart.js 설치
- [x] **Feat**: 관리자페이지 경기별 참여 유저수, 평점 입력갯수 집계 지표 차트 추가
- [x] **Test**: vitest,storybook 테스트코드 추가

## [1.2.1] - 2025-10-20

### ✅ 작업 내용

- [x] **Chore**: 커밋,푸시전 규칙 강화 코드 husky에 추가
- [x] **Test**: 평점입력컴포넌트 스토리북 케이스 추가
- [x] **Chore**: 평점입력 페이지 선수이미지 크기 축소
- [x] **Test**: 로그인페이지 테스트코드에 react-helmet 컨텍스트 추가
- [x] **Refactor**: 로그인 accessToken 획일화

## [1.1.1] - 2025-10-19

### ✅ 작업 내용

- [x] **Chore**: Sentry 기본세팅

## [1.0.2] - 2025-10-19

### ✅ 작업 내용

- [x] **Fix**: 평점 게이지 조절시 게이지 영역 밖에서 마우스포인터가 멈출시 게이지 값이 원래값으로 돌아가는 현상 수정
- [x] **Fix**: dashboard 페이지 최근경기, 선수DB 가로스크롤 + 클릭 기능 혼용으로 인한 오작동 현상 수정

## [1.0.1] - 2025-10-04

### ✅ 작업 내용

- [x] **Feature**: 분 단위 평점입력기능 추가
  - ratings 테이블 전,후반 시작종료 컬럼추가
  - minute 컬럼 integer -> text형 컬럼 변경
- [x] **Refactor**: 배포전 미사용 코드,컴포넌트 정리

### 🎯 요약

베타 테스트 성격 런칭 시작

## [0.14.1] - 2025-10-04

### ✅ 작업 내용

- [x] **Feature**: SEO등록하기
  - react-helmet-async 라이브러리 활용하여 custom-helmet 공통컴포넌트 제작
  - og,title등등 메타태그 설정
  - vite-plugin-sitemap 라이브러리 활용하여 sitemap, robot.txt 자동 컨피그 등록
  - 구글서치콘솔등록용 메타태그 추가

## [0.13.2] - 2025-10-02

### ✅ 작업 내용

- [x] **Feature**: 회원탈퇴 기능
  - 회원이 직접 회원탈퇴하는 기능 추가
  - 관리자가 회원탈퇴 시키는 기능 추가

## [0.13.1] - 2025-10-02

### ✅ 작업 내용

- [x] **Feature**: 경기별 평점 리스트 시스템 구현
  - 경기 정보와 선수 평점 데이터 병렬 조회 (`useSuspenseQueries`)
  - 골, 어시스트, 옐로카드, 레드카드, 교체 상태 표시 기능
  - BOTM(Best of the Match) 표시 및 평점 순위 정렬
  - Supabase S3 이미지를 활용한 통계 배지 시스템

- [x] **Testing**: MSW를 활용한 API 모킹 시스템
  - 스토리북 데코레이터 모듈화 (QueryClient 분리)
  - 로딩/에러 상태 시뮬레이션을 위한 MSW 핸들러 구현
  - 테스트 코드 러프하게 구현

### 🔧 기술요약

- **RPC 확장**: `get_matches_player_ratings` 함수에 선수 통계 필드 추가
- **정렬 로직**: BOTM 우선, 라인업 타입(스타팅/벤치), 라인(축구용어: 1선,2선,3선) 번호 순으로 정렬
- **상태 관리**: React Query의 `useSuspenseQueries`로 병렬 데이터 페칭
- **스토리북 데코레이터 제거**: Storybook msw적용을 위한 preview.ts상 queryclient 데코레이터 제거. 개별 스토리북에서 queryclient주입하도록 처리. 추후 별도 모듈을 만들어 주입시 공통 모듈을 삽입하는 방식 검토?

### 🎯 요약

경기별 평점 리스트 기능 완성. 선수의 상세 통계 표시와 직관적인 UI로 경기 분석 기능 제공.

## [0.12.3] - 2025-09-26

### ✅ 작업 내용

- [x] **관리자 페이지 그리드 레이아웃 통일**: 모든 admin 페이지에 AdminGridWrapper 적용
  - admin-player, admin-match, admin-competition, admin-team, admin-match-lineup 페이지 그리드 레이아웃 적용

### 🎯 요약

- AdminGridWrapper를 통한 8x8 그리드 레이아웃으로 잡음

## [0.12.2] - 2025-09-22

### ✅ 작업 내용

- [x] **UI 통합**: admin-match, admin-match-lineup에 YD-UI 적용
  - 테이블/모달 스타일을 `bg-background-*`, `border-primary-100`, `text-yds-b1` 기준으로 통일
  - 액션 아이콘 버튼 hover/색상 일관화
  - 모달 푸터 버튼을 YD-UI `Button`으로 교체
- [x] **SelectBox 통합**
  - 라인업 생성/수정 모달에 `SelectBox + useSelectBox` 도입 (선수/포지션/라인업 타입/교체 상태)
  - 검색 옵션 활성화 및 기본값 세팅
  - 교체 상태를 `NONE | SUBSTITUTED_IN | SUBSTITUTED_OUT`으로 변경
  - 교체 상태에 따라 교체 시간, 교체 대상 선수 입력/선택 UI 조건부 표기
- [x] **관리 화면 개선**
  - admin-match 목록 헤더 버튼을 YD-UI `Button`으로 교체
  - 테이블 외곽 `border-2`와 행 hover 효과로 가독성 향상

### 🔧 기술요약

- YD-UI SelectBox 훅 패턴 사용 (`filteredOptions`, `selectedText` 등 파생값 기반 렌더)
- 생성/수정 시 훅의 `label/value`를 API 파라미터로 매핑하여 폼 로직 단순화

### 🎯 요약

관리자 경기/라인업 화면에 YD-UI를 일관 적용하여 디자인 통일성과 폼 사용성을 개선. 라인업 교체 로직 표기를 도메인 용어(`SUBSTITUTED_IN/OUT`)로 명확화.

## [0.12.1] - 2025-09-18

### ✅ 작업 내용

- [x] **Feature**: 사용자 프로필 설정 시스템 RPC 기반으로 리팩토링
  - `insert_auth_profile` RPC 함수 구현 (nickname, favorite_player 지원)
  - `auth.uid()` 기본값 활용으로 사용자 인증 자동 처리
  - 프로필 중복 생성 방지 및 닉네임 중복 검증 로직 추가

### 개선, 작업 예정

- 사용자 프로필 설정시 퍼널형태로 닉네임, 좋아하는선수 등 하나의 한 데이터를 저장할 예정
- yd-ui의 select box를 compound 컴포넌트 패턴으로 구현함에따라 이에 맞게 컴포넌트 수정예정

## [0.11.4] - 2025-09-15

### ✅ 작업 내용

- [x] **Refactor**: 닉네임설정도메인 유저정보설정도메인으로 이름변경

## [0.11.2] - 2025-09-08

### ✅ 작업 내용

- [x] **Feature**: 드래그 가능한 평점 입력 게이지 컴포넌트 구현 (0.0~10.0, 0.1 단위)
- [x] **Feature**: 실시간 평점 시스템 멀티 브로드캐스트 구현 (개별 선수 + 전체 목록)
- [x] **Feature**: 전체 선수 목록 화면 실시간 평점 업데이트 기능
- [x] **Enhancement**: PostgreSQL 함수 필드 확장 (round_name, league_name, season, opponent_team_name, goals, assists)
- [x] **Optimization**: 상태 분리 패턴으로 드래그 중 리렌더링 최적화
- [x] **Refactor**: useGetLatestMatchDatas에 실시간 소켓통신 통합으로 훅 간소화

### 🔧 기술요약

- **드래그 게이지**: useRef로 실시간 드래그 입력 (useEffect 최소화)
- **멀티 브로드캐스트**: 평점 입력시 두 개 채널 동시 전송으로 개인화면, 전체화면 실시간 갱신
- **성능 최적화**: 상태 분리로 부모 컴포넌트 리렌더링 최소화
- **아키텍처 개선**: 별도 실시간 훅 제거하고 데이터 조회 훅에 통합

### 🎯 요약

실시간 평점 시스템 고도화 및 사용자 경험 개선. 전체 선수 목록에서도 실시간 평점 변화 확인 가능

## [0.11.1] - 2025-09-03

### ✅ 작업 내용

- [x] **Feature**: Supabase Realtime 실시간 평점 시스템 Broadcast 방식 실시간 통신 (베타테스트용) 구현
- [x] **Feature**: useEffect 최소화한 실시간 구독 훅 구현

### 🔧 기술요약

- **실시간 통신**: realtime에서 제공하는 broadcast 방식으로 구현
- 시간대별로 다중 평점 입력 가능 (minute 기반)
- **성능 최적화**: React Query invalidateQueries를 통한 캐시 관리
- **가독성, 최적화**: useEffect 하나만 사용해서 실시간 구독 훅 구현

### 🎯 요약

실시간 평점 시스템 테스트를 위한 기능 작업완료. 테스트 해보면서 실제기능으로 작업할 예정

## [0.11.0] - 2025-09-02

### ✅ 작업 내용

- [x] **Feature**: 평점입력 화면 초안 제작
- [x] **Refactor**: api 응답 타입 interfaqce 공통모듈화
- [x] **Feature**: 평점입력 컴포넌트 조회부분 제작작

## [0.8.0] - 2025-08-21

### ✅ 작업 내용

- [x] **Feature**: 최신경기 컴포넌트 선언적 호출
- [x] **Feature**: rpc api 두개 호출 suspenseQueries를 통해 병렬호출 처리
- [x] **Feature**: 선수카드 렌더링

### 진행 예정

- 선수카드 골,어시스트,옐로 카드, 교체등 다양한 상황 반영

### �� 요약

최신경기 컴포넌트 러프하게 제작

## [0.7.2] - 2025-08-20

### ✅ 작업 내용

- [x] **Fix**: 스토리북에서 쿼리클라이언트 경로 오류 수정
- [x] **Feature**: 웹뷰 화면 스크롤 방식 2가지 Provider 제작
  - `LayoutWithHeader`: Header만 있는 레이아웃 (내부 스크롤)
  - `LayoutWithHeaderFooter`: Header와 Footer가 있는 레이아웃 (가운데 스크롤)
- [x] **Refactor**: 레이아웃 높이 상수를 Tailwind CSS `@theme`에서 중앙 관리
- [x] **Refactor**: Dashboard 페이지를 새로운 레이아웃 Provider로 모듈화

### �� 요약

레이아웃 시스템 모듈화 및 Provider 패턴 도입

## [0.7.1] - 2025-08-19

### ✅ 작업 내용

- [x] **Fix**: 최근 경기, 선수DB 컴포넌트 브라우저환경 가로스크롤 이슈 Ref로 dom 건드리는 방식으로 해결
- [] **추후 고려사항**: 스크롤 모듈화?

### 🎯 요약

- 브라우저환경 가로 스크롤 오류 수정

## [0.7.0] - 2025-08-19

### ✅ 작업 내용

- [x] **Feature**: 최근 경기(`matches-history`) 컴포넌트 구현 (가로 스크롤 카드 리스트)
- [x] **Feature**: `MatchesHistoryWrapper` 추가 및 섹션 헤더 "최근 경기" 표시
- [x] **Feature**: 카드 썸네일 스토리지 이미지 `CARD_SECTION_IMAGE` 적용
- [x] **Feature**: 카드 클릭 시 `/match/:matchId/ratings`로 네비게이션 연결
- [x] **Skeleton/Error**: 최근 경기 스켈레톤·에러 폴백 컴포넌트 구현
- [] **Test**: 테스트코드 시간임박으로인한 추후 구현예정

### 🎯 요약

- 최근 경기 도메인 제작

### 📋 버전 관리 정책 (v0.6.1부터 적용)

- **Major**: 메이저 버전 (1.0.0 → 2.0.0) - 실제 서비스 격변
- **Feature**: 마이너 버전 (0.6.0 → 0.7.0)
- **Refactor/Fix**: 패치 버전 (0.6.1 → 0.6.2)

## [0.6.2] - 2025-08-19

### ✅ 작업 내용

- [x] **Refactor**: React.FC 타입 제거 및 명시적 props 타입 정의로 변경
- [x] **Fix**: 불필요한 children props 제거
- [x] **라이브러리 추가**: import 순서 정리 플러그인 설치
- [x] **Refactor**: 매직 넘버 상수화 작업 : user mock 데이터
- [x] **Fix**: 컴포넌트 네이밍 컨벤션 통일 : player -> players

### 🎯 요약

코드 품질 개선

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
