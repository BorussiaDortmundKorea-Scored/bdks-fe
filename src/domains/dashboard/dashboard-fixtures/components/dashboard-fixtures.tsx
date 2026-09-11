/**
 * 작성자: KYD
 * 기능: 경기 일정 위젯 - 다가오는 예정 경기 목록 (사이드 패널, 우승 기록 위)
 * 프로세스 설명: get_upcoming_matches 로 조회한 예정 경기를 한 줄씩 나열한다.
 *              도르트문트는 고정이라 생략하고 상대팀 로고·이름만 보여주며,
 *              우측에 홈/원정과 경기 날짜를 둔다.
 */
import { type IUpcomingMatch } from "@dashboard/dashboard-fixtures/api/dashboard-fixtures-api";
import { useGetUpcomingMatches } from "@dashboard/dashboard-fixtures/api/react-query-api/use-get-upcoming-matches";
import DashboardFixturesWrapper from "@dashboard/dashboard-fixtures/components/wrapper/dashboard-fixtures-wrapper";

// "2026-08-23" → "08.23"
const formatMatchDate = (date: string): string => date.slice(5).replace("-", ".");

// 킥오프 시각은 KST 기준으로 표시한다 (일정이 확정되지 않은 경기는 null)
const KST_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Seoul",
});

// "2026-08-23T13:30:00+00:00" → "22:30"
const formatMatchTime = (startTime: string | null): string | null =>
  startTime ? KST_TIME_FORMAT.format(new Date(startTime)) : null;

const FixtureRow = ({ match }: { match: IUpcomingMatch }) => {
  const isHome = match.text_home_away === "HOME";
  const kickOffTime = formatMatchTime(match.match_start_time);

  return (
    <div className="flex items-center gap-3 py-2">
      {/* 상대팀 로고 (배경 없이 엠블럼만, 잘리지 않도록 contain) */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center">
        {match.opponent_team_logo_image_url ? (
          <img
            src={match.opponent_team_logo_image_url}
            alt={`${match.opponent_name} 로고`}
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-yds-c2r text-primary-100">{match.opponent_name.slice(0, 2)}</span>
        )}
      </div>

      <span className="text-yds-c1m min-w-0 flex-1 truncate text-white">{match.opponent_name}</span>

      {/* 우측: 리그 / 홈·원정 · 날짜(+시간) 두 줄 */}
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-yds-c2r text-primary-100 max-w-[110px] truncate">{match.league_name}</span>
        <span className="text-yds-c1r text-white">
          {isHome ? "홈" : "원정"}
          <span className="text-primary-400/40"> | </span>
          {formatMatchDate(match.match_date)}
          {kickOffTime ? ` ${kickOffTime}` : ""}
        </span>
      </div>
    </div>
  );
};

const DashboardFixtures = () => {
  //SECTION HOOK호출 영역
  const matches = useGetUpcomingMatches();
  //!SECTION HOOK호출 영역

  return (
    <DashboardFixturesWrapper>
      {matches.length === 0 ? (
        <p className="text-yds-c1m text-primary-100">예정된 경기가 없습니다.</p>
      ) : (
        <ul className="flex w-full flex-col">
          {matches.map((match) => (
            <li key={match.id}>
              <FixtureRow match={match} />
            </li>
          ))}
        </ul>
      )}
    </DashboardFixturesWrapper>
  );
};

export default DashboardFixtures;
