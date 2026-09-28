/**
 * 작성자: KYD
 * 기능: 경기 요약 패널 스토리
 * 프로세스 설명: 이 패널은 쿼리가 없고 부모가 준 배열만 그리므로 MSW 없이 props 만으로 세운다.
 *              득점·경고·교체가 전부 있는 경기와, 하나도 없는 경기(빈 문구)를 같이 둔다.
 */
import { type IMatchInfo, type IMatchesHistoryPlayersRating } from "../../api/matches-history-players-rating-api";
import MatchSummaryPanel from "./match-summary-panel";
import MatchSummaryPanelSkeleton from "./skeleton/match-summary-panel-skeleton";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const HEAD_IMAGE_BASE = `${SUPABASE_STORAGE_URL}/players/head`;

const makePlayer = (
  id: number,
  korean_name: string,
  head_file: string,
  overrides: Partial<IMatchesHistoryPlayersRating> = {},
): IMatchesHistoryPlayersRating => ({
  player_id: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
  korean_name,
  head_profile_image_url: `${HEAD_IMAGE_BASE}/${head_file}`,
  position_detail_name: "CM",
  line_number: 3,
  position_sort_order: 300 + id,
  is_playing: true,
  avg_rating: 6.5,
  rating_count: 8,
  lineup_type: "STARTING",
  is_captain: false,
  goals: 0,
  assists: 0,
  sub_in_minute: null,
  sub_out_minute: null,
  yellow_cards: 0,
  red_card_minute: null,
  is_sent_off: false,
  botm: false,
  ...overrides,
});

/** 득점·도움·경고·퇴장·교체가 골고루 들어간 한 벌 (dev 함부르크 1R 테스트 데이터와 같은 모양) */
const PLAYERS: IMatchesHistoryPlayersRating[] = [
  makePlayer(1, "율리안 브란트", "head_brandt.png", { avg_rating: 8.3, goals: 1, assists: 1, botm: true }),
  makePlayer(2, "카림 아데예미", "head_adeyemi.png", { avg_rating: 7.4, goals: 1, sub_out_minute: 58 }),
  makePlayer(3, "막시밀리안 바이어", "head_beier.png", { avg_rating: 7.5, goals: 1, sub_out_minute: 79 }),
  makePlayer(4, "세루 기라시", "head_guirassy.png", { avg_rating: 7.4, goals: 1, sub_in_minute: 79 }),
  makePlayer(5, "다니엘 스벤손", "head_svensson.png", { avg_rating: 7.1, assists: 1 }),
  makePlayer(6, "파스칼 그로스", "head_gross.png", { avg_rating: 7.6, assists: 1, is_captain: true }),
  makePlayer(7, "니코 슐로터벡", "head_schlotterbeck.png", { avg_rating: 6.6, yellow_cards: 1 }),
  makePlayer(8, "얀 쿠토", "head_couto.png", {
    avg_rating: 4.0,
    yellow_cards: 2,
    red_card_minute: 88,
    is_sent_off: true,
  }),
  makePlayer(9, "살리흐 외즈잔", "head_ozcan.png", { avg_rating: 5.9, yellow_cards: 1, sub_out_minute: 66 }),
  makePlayer(10, "율리안 듀랑빌", "head_duranville.png", { avg_rating: 6.1, yellow_cards: 1, sub_in_minute: 58 }),
  makePlayer(11, "엠레 찬", "head_can.png", { avg_rating: 6.9, sub_in_minute: 66 }),
  makePlayer(12, "발데마르 안톤", "head_anton.png", { avg_rating: 6.5 }),
];

/** 기록이 하나도 없는 경기 — 카드마다 빈 문구가 나와야 한다 */
const QUIET_PLAYERS: IMatchesHistoryPlayersRating[] = [
  makePlayer(13, "알렉산더 마이어", "head_meyer.png", { avg_rating: 0, rating_count: 0 }),
  makePlayer(14, "라미 벤세바이니", "head_bensebaini.png", { avg_rating: 0, rating_count: 0 }),
];

const MATCH_INFO: IMatchInfo = {
  home_away: "HOME",
  our_score: 4,
  opponent_score: 2,
  competition_name: "분데스리가",
  season: "26-27",
  opponent_team_name: "함부르크",
};
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const meta: Meta<typeof MatchSummaryPanel> = {
  title: "Matches/MatchesHistory/MatchSummaryPanel",
  component: MatchSummaryPanel,
  parameters: {
    docs: {
      description: {
        component: [
          "경기 평점 화면에서 포메이션 오른쪽(좁은 화면에서는 아래)에 붙는 경기 정보 패널입니다.",
          "",
          "카드 5장: 경기 요약 / 이 경기 최고 평점 / 득점·도움 / 경고·퇴장 / 교체 기록.",
          "쿼리를 직접 하지 않고 부모가 이미 받아온 평점 응답만 씁니다.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[450px] p-4">
        <Story />
      </div>
    ),
  ],
  args: { players: PLAYERS, matchInfo: MATCH_INFO },
};

export default meta;

type Story = StoryObj<typeof MatchSummaryPanel>;

export const Default: Story = {
  name: "승리 (기록 가득)",
};

export const Draw: Story = {
  name: "무승부",
  args: { matchInfo: { ...MATCH_INFO, our_score: 2, opponent_score: 2 } },
};

export const Lose: Story = {
  name: "패배 (원정)",
  args: { matchInfo: { ...MATCH_INFO, home_away: "AWAY", our_score: 0, opponent_score: 3 } },
};

export const Empty: Story = {
  name: "기록 없음 (빈 문구)",
  args: { players: QUIET_PLAYERS, matchInfo: { ...MATCH_INFO, our_score: 0, opponent_score: 0 } },
};

export const Loading: Story = {
  name: "스켈레톤",
  render: () => <MatchSummaryPanelSkeleton />,
};
