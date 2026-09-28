/**
 * 작성자: KYD
 * 기능: 포메이션 선수 카드 배지 조합 카탈로그
 * 프로세스 설명: 카드는 값이 넘어온 배지만 그린다. 실제 경기 데이터로는 퇴장·2경고·sub-for-sub
 *              같은 조합을 한 화면에서 보기 어려워, 여기서 조합별로 하나씩 깔아 둔다.
 */
import { MemoryRouter } from "react-router-dom";

import FormationPlayerCard from "./formation-player-card";
import { type IFormationPlayer } from "./formation-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const HEAD_IMAGE_BASE = `${SUPABASE_STORAGE_URL}/players/head`;

/** 배지가 하나도 없는 기준 카드. 각 스토리는 여기서 필요한 필드만 덮어쓴다 */
const BASE_PLAYER: IFormationPlayer = {
  playerId: "00000000-0000-4000-8000-000000000001",
  name: "그레고르 코벨",
  imageUrl: `${HEAD_IMAGE_BASE}/head_kobel.png`,
  rating: 7.0,
  ratingCount: 12,
};

/** 카드는 옐로우 월 위에 얹히므로 어두운 배경에서 봐야 그림자·글자 대비가 실제와 같다 */
const StageDecorator = (Story: React.ComponentType) => (
  <MemoryRouter>
    <div className="bg-background-secondary-layer flex min-h-[160px] items-center justify-center bg-neutral-900 p-6">
      <Story />
    </div>
  </MemoryRouter>
);
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const meta: Meta<typeof FormationPlayerCard> = {
  title: "Shared/Match/FormationPlayerCard",
  component: FormationPlayerCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "포메이션 한 칸에 들어가는 선수 카드입니다. 대시보드 최신경기와 경기 평점 화면이 같은 코드를 씁니다.",
          "",
          "- 우하단: 평점 (`ratingCount`가 0이면 `-`)",
          "- 좌상단: BOTM(`isBestOfTheMatch`) > 주장(`isCaptain`) 순으로 하나만",
          "- 우상단: 골 — 넣은 개수만큼 아이콘을 그대로 나열",
          "- 좌하단: 경고 장수. `isSentOff`면 옐로 뒤에 레드가 붙는다(경고누적은 옐로 1장 + 레드)",
          "- 아바타 아래: 교체 IN·OUT 분",
          "",
          "카드에 이름은 쓰지 않습니다. 전체 이름은 `img`의 `alt`와 링크의 `aria-label`·`title`에만 남습니다.",
        ].join("\n"),
      },
    },
  },
  decorators: [StageDecorator],
  args: { player: BASE_PLAYER },
};

export default meta;

type Story = StoryObj<typeof FormationPlayerCard>;

//SECTION 낱개 상태
export const Default: Story = {};

export const NotRated: Story = {
  name: "미평가 (평점 대신 -)",
  args: { player: { ...BASE_PLAYER, rating: 0, ratingCount: 0 } },
};

export const Captain: Story = {
  name: "주장",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "니코 슐로터벡",
      imageUrl: `${HEAD_IMAGE_BASE}/head_schlotterbeck.png`,
      rating: 7.1,
      isCaptain: true,
    },
  },
};

export const BestOfTheMatch: Story = {
  name: "BOTM (주장보다 우선)",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "세루 기라시",
      imageUrl: `${HEAD_IMAGE_BASE}/head_guirassy.png`,
      rating: 8.4,
      isCaptain: true,
      isBestOfTheMatch: true,
    },
  },
};

export const OneGoal: Story = {
  name: "1골",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "카림 아데예미",
      imageUrl: `${HEAD_IMAGE_BASE}/head_adeyemi.png`,
      rating: 7.4,
      goals: 1,
    },
  },
};

export const Hattrick: Story = {
  name: "3골",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "세루 기라시",
      imageUrl: `${HEAD_IMAGE_BASE}/head_guirassy.png`,
      rating: 9.2,
      goals: 3,
    },
  },
};

export const FourGoals: Story = {
  name: "4골 (아이콘 그대로 4개)",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "세루 기라시",
      imageUrl: `${HEAD_IMAGE_BASE}/head_guirassy.png`,
      rating: 9.8,
      goals: 4,
    },
  },
};

export const YellowCard: Story = {
  name: "경고 1장",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "다니엘 스벤손",
      imageUrl: `${HEAD_IMAGE_BASE}/head_svensson.png`,
      rating: 6.1,
      yellowCards: 1,
    },
  },
};

export const SentOff: Story = {
  name: "경고누적 퇴장 (옐로 → 레드)",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "얀 쿠토",
      imageUrl: `${HEAD_IMAGE_BASE}/head_couto.png`,
      rating: 4.0,
      yellowCards: 2,
      isSentOff: true,
    },
  },
};

export const StraightRed: Story = {
  name: "다이렉트 퇴장 (레드만)",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "조브 벨링엄",
      imageUrl: `${HEAD_IMAGE_BASE}/head_jobe.png`,
      rating: 3.9,
      isSentOff: true,
    },
  },
};

export const SubstitutedIn: Story = {
  name: "교체 투입",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "율리안 듀랑빌",
      imageUrl: `${HEAD_IMAGE_BASE}/head_duranville.png`,
      rating: 6.1,
      subInMinute: 58,
    },
  },
};

export const SubstitutedOut: Story = {
  name: "교체 아웃",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "막시밀리안 바이어",
      imageUrl: `${HEAD_IMAGE_BASE}/head_beier.png`,
      rating: 7.5,
      goals: 1,
      subOutMinute: 79,
    },
  },
};

export const SubInAndOut: Story = {
  name: "교체 투입 후 다시 교체 아웃 (sub-for-sub)",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "율리안 브란트",
      imageUrl: `${HEAD_IMAGE_BASE}/head_brandt.png`,
      rating: 6.9,
      yellowCards: 1,
      subInMinute: 62,
      subOutMinute: 84,
    },
  },
};

export const Everything: Story = {
  name: "배지 총출동",
  args: {
    player: {
      ...BASE_PLAYER,
      name: "율리안 브란트",
      imageUrl: `${HEAD_IMAGE_BASE}/head_brandt.png`,
      rating: 8.3,
      isBestOfTheMatch: true,
      goals: 2,
      yellowCards: 2,
      isSentOff: true,
      subInMinute: 62,
      subOutMinute: 84,
    },
  },
};

export const WithLink: Story = {
  name: "링크 (평점 입력으로 이동)",
  args: { to: "/match/match-001/player/player-001" },
};

export const LinkDisabled: Story = {
  name: "링크 막힘 (미출전 선수)",
  args: {
    player: { ...BASE_PLAYER, rating: 0, ratingCount: 0 },
    to: "/match/match-001/player/player-001",
    disabledReason: "출전하지 않은 선수는 평점을 입력할 수 없어요",
  },
};
//!SECTION 낱개 상태

//SECTION 한눈에 보기
const CATALOG: { label: string; player: IFormationPlayer }[] = [
  { label: "기본", player: BASE_PLAYER },
  { label: "미평가", player: { ...BASE_PLAYER, rating: 0, ratingCount: 0 } },
  { label: "주장", player: { ...BASE_PLAYER, isCaptain: true } },
  { label: "BOTM", player: { ...BASE_PLAYER, rating: 8.4, isBestOfTheMatch: true } },
  { label: "1골", player: { ...BASE_PLAYER, goals: 1 } },
  { label: "3골", player: { ...BASE_PLAYER, goals: 3 } },
  { label: "4골", player: { ...BASE_PLAYER, goals: 4 } },
  { label: "경고 1", player: { ...BASE_PLAYER, yellowCards: 1 } },
  { label: "경고누적 퇴장", player: { ...BASE_PLAYER, yellowCards: 2, isSentOff: true } },
  { label: "다이렉트 퇴장", player: { ...BASE_PLAYER, isSentOff: true } },
  { label: "교체 IN", player: { ...BASE_PLAYER, subInMinute: 58 } },
  { label: "교체 OUT", player: { ...BASE_PLAYER, subOutMinute: 79 } },
  { label: "IN + OUT", player: { ...BASE_PLAYER, subInMinute: 62, subOutMinute: 84 } },
  {
    label: "총출동",
    player: {
      ...BASE_PLAYER,
      rating: 8.3,
      isBestOfTheMatch: true,
      goals: 2,
      yellowCards: 2,
      isSentOff: true,
      subInMinute: 62,
      subOutMinute: 84,
    },
  },
];

export const AllBadges: Story = {
  name: "전체 배지 한눈에",
  parameters: { layout: "fullscreen" },
  // meta 의 layout:"centered" 래퍼가 내용 폭으로 줄어들어서, 폭을 직접 잡아야 가로로 펼쳐진다
  render: () => (
    <div className="w-screen max-w-full bg-neutral-900 p-6">
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-6">
        {CATALOG.map(({ label, player }) => (
          <div key={label} className="flex w-[84px] flex-col items-center gap-2">
            <FormationPlayerCard player={player} />
            <span className="text-primary-100 text-center text-[10px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
//!SECTION 한눈에 보기
