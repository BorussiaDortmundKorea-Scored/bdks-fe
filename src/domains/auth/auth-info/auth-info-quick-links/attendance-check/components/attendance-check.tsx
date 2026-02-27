import { useGetAttendanceMatches } from "@auth/auth-info/auth-info-quick-links/attendance-check/api/react-query-api/use-get-attendance-matches";

const AttendanceCheck = () => {
  const { data: matches } = useGetAttendanceMatches();

  const pastMatches = matches.filter((match) => match.status === "PAST");
  const upcomingMatches = matches.filter((match) => match.status === "TODAY" || match.status === "UPCOMING");

  return (
    <div className="mt-4 flex w-full flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-yds-b1 text-white">다가오는 경기</h2>
        {upcomingMatches.length === 0 ? (
          <div className="rounded-lg card-navy-50 bg-background-tertiary text-yds-b3">
            예정된 경기가 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {upcomingMatches.map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between rounded-lg card-navy-50 bg-background-tertiary text-yds-b3 text-primary-90"
              >
                <div className="flex items-center gap-4">
                  <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-background-secondary">
                    {match.opponent_team_logo_image_url && (
                      <img
                        src={match.opponent_team_logo_image_url}
                        alt={`${match.opponent_team_name} 로고`}
                        className="h-12 w-12 shrink-0 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-yds-b2 text-primary-100">
                      {match.season} {match.competition_name} {match.round_name}
                    </span>
                    <span className="text-white text-yds-c1r">
                      {match.match_date} · {match.home_away === "HOME" ? "홈" : "원정"} · vs {match.opponent_team_name}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#e9be11] px-3 py-2 text-center text-yds-c1m shrink-0 cursor-pointer">
                  {match.status === "TODAY" ? "오늘 경기" : "예정"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-yds-b1 text-white">지난 경기</h2>
        {pastMatches.length === 0 ? (
          <div className="rounded-lg card-navy-50 bg-background-tertiary text-yds-b3 ">
            지난 경기가 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {pastMatches.map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between rounded-lg card-navy-50 bg-background-tertiary text-yds-b3 text-primary-90"
              >
                <div className="flex items-center gap-4">
                  <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-background-secondary">
                    {match.opponent_team_logo_image_url && (
                      <img
                        src={match.opponent_team_logo_image_url}
                        alt={`${match.opponent_team_name} 로고`}
                        className="h-12 w-12 shrink-0 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-yds-b2 text-primary-100">
                      {match.season} {match.competition_name} {match.round_name}
                    </span>
                    <span className="text-white text-yds-c1r">
                      {match.match_date} · {match.home_away === "HOME" ? "홈" : "원정"} · vs {match.opponent_team_name}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#e9be11] px-3 py-2 text-center text-yds-c1m shrink-0 cursor-pointer">
                  관람체크
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AttendanceCheck;

