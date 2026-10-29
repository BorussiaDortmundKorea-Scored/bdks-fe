/**
 * 작성자: KYD
 * 기능: 포메이션 카드 크기·모양 클래스 (선수 카드 · 빈 자리 카드 공용)
 * 프로세스 설명: 빈 자리 카드가 선수 카드와 같은 칸을 차지해야 줄 배치가 흔들리지 않는다.
 *              두 카드가 크기·다이아몬드 모양을 따로 들고 있으면 한쪽만 바뀌기 쉬워서 여기로 모았다.
 */

/** 카드 폭 — 한 줄 4명이 320px 에서도 안 넘치는 값 */
export const CARD_WIDTH_CLASS = "xs:w-[60px] w-[52px] sm:w-[68px] md:w-[78px]";
/**
 * 아바타 칸 = 카드 폭의 정사각형. 다이아몬드 대각선이 곧 칸 폭이라, 칸을 카드 폭까지 넓혀야
 * 옆 선수와 겹치지 않는 선에서 다이아몬드가 가장 커진다.
 * `isolate` 로 쌓임맥락을 아바타 하나에 가둬서, 배지끼리의 겹침 순서가 카드 바깥(포메이션 라인,
 * 보드 토글 등)의 z-index 와 섞이지 않게 한다.
 */
export const AVATAR_CLASS = "relative isolate aspect-square w-full";
/**
 * 사각형을 45도 돌려 아바타 칸에 내접시킨다. 대각선이 칸 폭과 같아지려면 한 변이 1/√2 ≈ 70.7%,
 * 즉 사방 14.6% 씩 안쪽으로 들어가야 네 꼭짓점이 칸의 변 중앙에 닿는다.
 * 그래서 칸의 네 모서리가 비고, 배지들이 그 빈 모서리에 앉는다.
 *
 * 테두리 색은 yd-ui 의 `border-primary-400` 을 쓰지 않는다. 그 유틸리티는 색과 함께
 * `border-radius: var(--yds-border-radius)`(8px)·border-width 까지 박아 두고 rounded-none 보다
 * 뒤에 선언돼 있어서, 같이 써도 꼭짓점이 둥글게 남는다. 색만 지정하는 임의값으로 대신한다.
 */
export const DIAMOND_CLASS = "inset-[14.6%] rotate-45 border-2 border-[var(--color-primary-400)]";
/** 머리가 칸 위로 튀어나오는 만큼 위를 비워 윗줄 카드와 겹치지 않게 한다 */
export const CARD_CONTAINER_CLASS = `flex shrink-0 flex-col items-center gap-1 pt-2 sm:pt-2.5 md:pt-3 ${CARD_WIDTH_CLASS}`;
