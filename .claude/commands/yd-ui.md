# yd-ui 컴포넌트 참고

bdks-fe 프로젝트는 `@youngduck/yd-ui` 디자인 시스템 라이브러리를 사용합니다.

컴포넌트 작업 시 아래 문서 URL을 WebFetch로 읽어서 올바른 props, 사용법, import 경로를 확인하세요.

## 문서 사이트

베이스 URL: `https://yds-yd-ui.vercel.app`

## 디자인 토큰 문서 URL

색상, 타이포그래피, 간격 등 토큰 관련 작업 시 아래 문서를 먼저 읽으세요.

| 토큰 | URL |
|------|-----|
| 개요 (토큰 계층 구조 및 설계 의도) | https://yds-yd-ui.vercel.app/tokens/overview.html |
| Color | https://yds-yd-ui.vercel.app/tokens/color.html |
| Typography | https://yds-yd-ui.vercel.app/tokens/typography.html |
| Spacing & Border | https://yds-yd-ui.vercel.app/tokens/spacing.html |

## 컴포넌트별 문서 URL

| 컴포넌트 | URL |
|----------|-----|
| Button | https://yds-yd-ui.vercel.app/components/button.html |
| Input | https://yds-yd-ui.vercel.app/components/input.html |
| SelectBox | https://yds-yd-ui.vercel.app/components/selectbox.html |
| CheckBox | https://yds-yd-ui.vercel.app/components/checkbox.html |
| Card | https://yds-yd-ui.vercel.app/components/card.html |
| Chips | https://yds-yd-ui.vercel.app/components/chips.html |
| Table | https://yds-yd-ui.vercel.app/components/table.html |

## 사용 지침

- 색상, 타이포그래피, 간격 작업 시 토큰 문서를 먼저 읽고 디자인 토큰 클래스(`bg-background-*`, `text-yds-*` 등)를 우선 사용하세요.
- yd-ui 컴포넌트를 새로 사용하거나 수정할 때는 반드시 해당 컴포넌트 문서를 먼저 읽으세요.
- import 경로, props 타입, 사용 예시를 문서 기준으로 따르세요.
- 문서에 없는 커스터마이징은 `className` prop을 통해 Tailwind로 처리합니다.
