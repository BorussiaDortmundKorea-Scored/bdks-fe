/**
 * 작성자: KYD
 * 기능: 포메이션 보드 전체 배치 확인용 스토리
 * 프로세스 설명: 낱개 배지는 formation-player-card.stories 에서 보고, 여기서는 11명이 실제로
 *              라인별로 앉았을 때의 모습과 교체 탭을 본다. 배지가 골고루 박힌 4-2-3-1 한 벌을
 *              고정 데이터로 깔아 두어 좁은 화면에서 줄이 잘리지 않는지도 같이 확인한다.
 */
import { MemoryRouter } from "react-router-dom";

import FormationBoard from "./formation-board";
import { type FormationLines, type IFormationPlayer } from "./formation-types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const HEAD_IMAGE_BASE = `${SUPABASE_STORAGE_URL}/players/head`;

const makePlayer = (
  id: number,
  name: string,
  image: string,
  rating: number,
  extra: Partial<IFormationPlayer> = {},
): IFormationPlayer => ({
  playerId: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
  name,
  imageUrl: `${HEAD_IMAGE_BASE}/${image}`,
  rating,
  ratingCount: rating === 0 ? 0 : 8,
  ...extra,
});

/**
 * 4-2-3-1. 키가 곧 line_number 이고 1선(ST)이 위, 5선(GK)이 아래로 그려진다.
 * 훅이 만들어 주는 모양과 같게 두려고 일부러 Record 로 둔다.
 */
const PLAYING_MEMBERS: FormationLines = {
  // 4골이라 골 아이콘 3개 + ×4 로 넘어간다
  1: [makePlayer(1, "세루 기라시", "head_guirassy.png", 9.1, { goals: 4, subInMinute: 79 })],
  2: [
    // 교체 연쇄의 마지막 — 78분에 들어와 그대로 종료
    makePlayer(2, "요안니스 콘스탄텔리아스", "head_konstantelias.png", 6.4, { subInMinute: 78 }),
    makePlayer(3, "율리안 브란트", "head_brandt.png", 8.3, { goals: 1, yellowCards: 1, isBestOfTheMatch: true }),
    makePlayer(4, "카니 추쿠에메카", "head_chukwuemeka.png", 6.4),
  ],
  3: [
    makePlayer(5, "엠레 찬", "head_can.png", 6.9, { subInMinute: 66 }),
    makePlayer(6, "파스칼 그로스", "head_gross.png", 7.6, { isCaptain: true }),
  ],
  4: [
    makePlayer(7, "다니엘 스벤손", "head_svensson.png", 7.1),
    makePlayer(8, "니코 슐로터벡", "head_schlotterbeck.png", 6.6, { yellowCards: 1 }),
    makePlayer(9, "발데마르 안톤", "head_anton.png", 6.5),
    makePlayer(10, "얀 쿠토", "head_couto.png", 4.0, { yellowCards: 2, isSentOff: true }),
  ],
  5: [makePlayer(11, "알렉산더 마이어", "head_meyer.png", 6.4)],
};

/**
 * 교체로 빠진 선수 — 카드에 교체 아웃 분이 붙는다.
 * 듀랑빌은 58분에 들어왔다가 78분에 다시 빠진 sub-for-sub 라 IN·OUT 이 한 카드에 같이 나온다.
 */
const SUBSTITUTED_OUT_PLAYERS: IFormationPlayer[] = [
  makePlayer(12, "카림 아데예미", "head_adeyemi.png", 7.4, { goals: 1, subOutMinute: 58 }),
  makePlayer(13, "율리안 듀랑빌", "head_duranville.png", 6.1, { yellowCards: 1, subInMinute: 58, subOutMinute: 78 }),
  makePlayer(14, "살리흐 외즈잔", "head_ozcan.png", 5.9, { yellowCards: 1, subOutMinute: 66 }),
  makePlayer(20, "막시밀리안 바이어", "head_beier.png", 7.5, { goals: 1, subOutMinute: 79 }),
];

/** 미출전 — 평점이 0건이라 카드에 `-` 가 나온다 */
const UNUSED_PLAYERS: IFormationPlayer[] = [
  makePlayer(15, "그레고르 코벨", "head_kobel.png", 0),
  makePlayer(16, "라미 벤세바이니", "head_bensebaini.png", 0),
  makePlayer(17, "니클라스 쥘레", "head_sule.png", 0),
  makePlayer(18, "파비우 실바", "head_silva.png", 0),
  makePlayer(19, "콜 캠벨", "head_campbell.png", 0),
];

const SCORE_HEADER = <div className="text-md text-primary-100 shrink-0 font-semibold">4 : 2</div>;
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const meta: Meta<typeof FormationBoard> = {
  title: "Shared/Match/FormationBoard",
  component: FormationBoard,
  parameters: {
    docs: {
      description: {
        component: [
          "옐로우 월 위에 경기정보 + 포메이션을 그리는 보드입니다. 대시보드 최신경기와 경기 평점 화면이 같은 코드를 씁니다.",
          "",
          "우하단 토글로 **선발**(그라운드 11명)과 **교체**(교체 아웃 + 미출전)를 오간다.",
          "셸은 2:3 을 *최소* 높이로만 쓰기 때문에, 카드가 커져 내용이 넘치면 잘리지 않고 보드가 늘어난다.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="mx-auto w-full max-w-[450px]">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    title: "도르트문트(H) vs 함부르크",
    subtitle: "26-27 분데스리가",
    headerRight: SCORE_HEADER,
    playingMembers: PLAYING_MEMBERS,
    substitutedOutPlayers: SUBSTITUTED_OUT_PLAYERS,
    unusedPlayers: UNUSED_PLAYERS,
  },
};

export default meta;

type Story = StoryObj<typeof FormationBoard>;

export const Default: Story = {
  name: "선발 (배지 총집합)",
};

export const Substitutes: Story = {
  name: "교체 탭",
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "교체" }));
  },
};

export const WithPlayerLink: Story = {
  name: "카드가 링크일 때 (평점 입력 이동)",
  args: {
    getPlayerLink: (player) => `/match/match-001/player/${player.playerId}`,
    unusedPlayerDisabledReason: "출전하지 않은 선수는 평점을 입력할 수 없어요",
  },
};

export const NoRatingsYet: Story = {
  name: "아직 아무도 평점을 안 줬을 때",
  args: {
    playingMembers: Object.fromEntries(
      Object.entries(PLAYING_MEMBERS).map(([line, players]) => [
        line,
        players.map((player) => ({ ...player, rating: 0, ratingCount: 0, isBestOfTheMatch: false })),
      ]),
    ) as FormationLines,
  },
};

export const NoSubstitutes: Story = {
  name: "교체 명단이 비었을 때",
  args: { substitutedOutPlayers: [], unusedPlayers: [] },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "교체" }));
  },
};

export const Iphone5: Story = {
  name: "좁은 화면 (320px)",
  globals: { viewport: { value: "iphone5", isRotated: false } },
};

export const Iphone12: Story = {
  name: "모바일 (390px)",
  globals: { viewport: { value: "iphone12", isRotated: false } },
};
