import { type IMatchInfo, type IMatchesHistoryPlayersRating } from "../../api/matches-history-players-rating-api";
import MatchSummaryPanel from "./match-summary-panel";
import { render, screen, within } from "@testing-library/react";

const makePlayer = (
  id: number,
  korean_name: string,
  overrides: Partial<IMatchesHistoryPlayersRating> = {},
): IMatchesHistoryPlayersRating => ({
  player_id: `player-${id}`,
  korean_name,
  head_profile_image_url: `https://example.test/head-${id}.png`,
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

const MATCH_INFO: IMatchInfo = {
  home_away: "HOME",
  our_score: 4,
  opponent_score: 2,
  competition_name: "분데스리가",
  season: "26-27",
  opponent_team_name: "함부르크",
};

/** 카드 제목으로 영역을 좁힌다. 같은 선수 이름이 여러 카드에 나오기 때문이다 */
const getCard = (title: string) => screen.getByRole("heading", { name: title }).parentElement as HTMLElement;

describe("경기 요약 패널 렌더링 테스트", () => {
  it("승/무/패를 스코어로 판단해 보여준다", () => {
    const { rerender } = render(<MatchSummaryPanel players={[]} matchInfo={MATCH_INFO} />);
    expect(within(getCard("경기 요약")).getByText("승")).toBeInTheDocument();

    rerender(<MatchSummaryPanel players={[]} matchInfo={{ ...MATCH_INFO, our_score: 2, opponent_score: 2 }} />);
    expect(within(getCard("경기 요약")).getByText("무")).toBeInTheDocument();

    rerender(<MatchSummaryPanel players={[]} matchInfo={{ ...MATCH_INFO, our_score: 0, opponent_score: 1 }} />);
    expect(within(getCard("경기 요약")).getByText("패")).toBeInTheDocument();
  });

  it("골과 도움을 둘 다 한 선수는 한 줄로 합쳐 보여준다", () => {
    const players = [
      makePlayer(1, "율리안 브란트", { goals: 1, assists: 1 }),
      makePlayer(2, "세루 기라시", { goals: 2 }),
      makePlayer(3, "파스칼 그로스", { assists: 1 }),
      makePlayer(4, "발데마르 안톤"),
    ];
    render(<MatchSummaryPanel players={players} matchInfo={MATCH_INFO} />);

    const card = getCard("득점 · 도움");
    expect(within(card).getByText("1골 · 1도움")).toBeInTheDocument();
    expect(within(card).getByText("2골")).toBeInTheDocument();
    expect(within(card).getByText("1도움")).toBeInTheDocument();
    // 기록이 없는 선수는 아예 나오지 않는다
    expect(within(card).queryByText("발데마르 안톤")).not.toBeInTheDocument();
  });

  it("퇴장은 분까지, 경고는 장수로 보여준다", () => {
    const players = [
      makePlayer(1, "얀 쿠토", { yellow_cards: 2, red_card_minute: 88, is_sent_off: true }),
      makePlayer(2, "니코 슐로터벡", { yellow_cards: 1 }),
    ];
    render(<MatchSummaryPanel players={players} matchInfo={MATCH_INFO} />);

    const card = getCard("경고 · 퇴장");
    expect(within(card).getByText("퇴장 88'")).toBeInTheDocument();
    expect(within(card).getByText("경고 1")).toBeInTheDocument();
  });

  it("같은 분의 IN/OUT 을 'OUT → IN' 한 줄로 묶고 시간순으로 정렬한다", () => {
    const players = [
      makePlayer(1, "세루 기라시", { sub_in_minute: 79 }),
      makePlayer(2, "막시밀리안 바이어", { sub_out_minute: 79 }),
      makePlayer(3, "율리안 듀랑빌", { sub_in_minute: 58 }),
      makePlayer(4, "카림 아데예미", { sub_out_minute: 58 }),
    ];
    render(<MatchSummaryPanel players={players} matchInfo={MATCH_INFO} />);

    const card = getCard("교체 기록");
    expect(within(card).getByText("카림 아데예미 → 율리안 듀랑빌")).toBeInTheDocument();
    expect(within(card).getByText("막시밀리안 바이어 → 세루 기라시")).toBeInTheDocument();

    const minutes = within(card)
      .getAllByText(/^\d+'$/)
      .map((element) => element.textContent);
    expect(minutes).toEqual(["58'", "79'"]);
  });

  it("BOTM 선수가 없으면 최고 평점 카드에 안내 문구가 나온다", () => {
    render(<MatchSummaryPanel players={[makePlayer(1, "발데마르 안톤")]} matchInfo={MATCH_INFO} />);

    expect(within(getCard("이 경기 최고 평점")).getByText("아직 평점이 없어요")).toBeInTheDocument();
  });

  it("기록이 하나도 없으면 카드마다 빈 문구를 보여준다", () => {
    render(<MatchSummaryPanel players={[makePlayer(1, "발데마르 안톤")]} matchInfo={MATCH_INFO} />);

    expect(screen.getByText("득점 기록이 없어요")).toBeInTheDocument();
    expect(screen.getByText("경고·퇴장이 없어요")).toBeInTheDocument();
    expect(screen.getByText("교체가 없었어요")).toBeInTheDocument();
  });
});
