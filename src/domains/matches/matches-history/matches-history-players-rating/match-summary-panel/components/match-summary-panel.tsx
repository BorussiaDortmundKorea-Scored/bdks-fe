/**
 * 작성자: KYD
 * 기능: 경기 요약 패널 - 포메이션 옆에 붙는 경기 관련 정보 모음
 * 프로세스 설명: 넓은 화면에서만 포메이션 오른쪽에 붙고, 좁은 화면에서는 아래로 떨어진다.
 *              부모가 이미 받아온 평점 응답만 쓰기 때문에 이 컴포넌트에는 쿼리가 없다.
 *              ① 경기 요약 ② 이 경기 최고 평점 ③ 득점·도움 ④ 경고·퇴장 ⑤ 교체 기록
 */
import { type IMatchInfo, type IMatchesHistoryPlayersRating } from "../../api/matches-history-players-rating-api";

interface IMatchSummaryPanelProps {
  players: IMatchesHistoryPlayersRating[];
  matchInfo: IMatchInfo;
}

const PanelCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-background-secondary flex w-full flex-col gap-2 rounded-[4px] p-4">
    <h3 className="text-yds-c1m text-primary-100">{title}</h3>
    {children}
  </section>
);

const EmptyRow = ({ label }: { label: string }) => <p className="text-yds-c1r text-white/50">{label}</p>;

const MatchSummaryPanel = ({ players, matchInfo }: IMatchSummaryPanelProps) => {
  //SECTION 상태값 영역
  const isWin = matchInfo.our_score > matchInfo.opponent_score;
  const isDraw = matchInfo.our_score === matchInfo.opponent_score;
  const resultLabel = isDraw ? "무" : isWin ? "승" : "패";

  // 골과 도움을 따로 나열하면 둘 다 한 선수가 두 줄로 쪼개진다. 선수 기준 한 줄로 합친다.
  const contributors = players
    .filter((player) => player.goals > 0 || player.assists > 0)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists);
  const bookedPlayers = players.filter((player) => player.yellow_cards > 0 || player.red_card_minute !== null);
  // 같은 분에 일어난 IN/OUT 을 한 줄로 묶어 "OUT → IN" 으로 보여준다
  const substitutions = players
    .filter((player) => player.sub_in_minute !== null)
    .map((inPlayer) => ({
      minute: inPlayer.sub_in_minute as number,
      inName: inPlayer.korean_name,
      outName: players.find((player) => player.sub_out_minute === inPlayer.sub_in_minute)?.korean_name ?? null,
    }))
    .sort((a, b) => a.minute - b.minute);

  const bestPlayer = players.find((player) => player.botm);
  //!SECTION 상태값 영역

  return (
    <aside className="flex w-full flex-col gap-4">
      <PanelCard title="경기 요약">
        <div className="flex items-center justify-between">
          <span className="text-yds-b2 text-white">
            도르트문트({matchInfo.home_away === "HOME" ? "홈" : "원정"}) vs {matchInfo.opponent_team_name}
          </span>
          <span className="text-yds-b1 text-primary-400">
            {matchInfo.our_score} : {matchInfo.opponent_score}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-yds-c1r text-white/70">
            {matchInfo.season} {matchInfo.competition_name}
          </span>
          <span className="text-yds-c1m text-primary-100">{resultLabel}</span>
        </div>
      </PanelCard>

      <PanelCard title="이 경기 최고 평점">
        {bestPlayer ? (
          <div className="flex items-center gap-3">
            <img
              src={bestPlayer.head_profile_image_url}
              alt={bestPlayer.korean_name}
              loading="lazy"
              className="border-primary-400 h-10 w-10 rounded-full border-2 object-cover"
            />
            <span className="text-yds-b2 flex-1 truncate text-white">{bestPlayer.korean_name}</span>
            <span className="text-yds-b2 text-primary-400 font-bold">{bestPlayer.avg_rating}</span>
          </div>
        ) : (
          <EmptyRow label="아직 평점이 없어요" />
        )}
      </PanelCard>

      <PanelCard title="득점 · 도움">
        {contributors.length === 0 ? (
          <EmptyRow label="득점 기록이 없어요" />
        ) : (
          contributors.map((player) => (
            <div key={player.player_id} className="flex items-center justify-between gap-2">
              <span className="text-yds-c1r min-w-0 flex-1 truncate text-white">{player.korean_name}</span>
              <span className="text-yds-c1m text-primary-100 shrink-0">
                {[player.goals > 0 && `${player.goals}골`, player.assists > 0 && `${player.assists}도움`]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          ))
        )}
      </PanelCard>

      <PanelCard title="경고 · 퇴장">
        {bookedPlayers.length === 0 ? (
          <EmptyRow label="경고·퇴장이 없어요" />
        ) : (
          bookedPlayers.map((player) => (
            <div key={player.player_id} className="flex items-center justify-between">
              <span className="text-yds-c1r text-white">{player.korean_name}</span>
              <span className="text-yds-c1m text-primary-100">
                {player.red_card_minute !== null ? `퇴장 ${player.red_card_minute}'` : `경고 ${player.yellow_cards}`}
              </span>
            </div>
          ))
        )}
      </PanelCard>

      <PanelCard title="교체 기록">
        {substitutions.length === 0 ? (
          <EmptyRow label="교체가 없었어요" />
        ) : (
          substitutions.map((substitution) => (
            <div key={`${substitution.minute}-${substitution.inName}`} className="flex items-center justify-between">
              <span className="text-yds-c1r min-w-0 flex-1 truncate text-white">
                {substitution.outName ? `${substitution.outName} → ` : ""}
                {substitution.inName}
              </span>
              <span className="text-yds-c1m text-primary-100 shrink-0">{substitution.minute}'</span>
            </div>
          ))
        )}
      </PanelCard>
    </aside>
  );
};

export default MatchSummaryPanel;
