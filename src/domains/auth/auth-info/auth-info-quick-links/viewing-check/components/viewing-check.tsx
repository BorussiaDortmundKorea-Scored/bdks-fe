import { useInsertViewingCheck } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/react-query-api/use-insert-viewing-check";
import { useGetViewingMatches } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/react-query-api/use-get-viewing-matches";
import { useAuth } from "@auth/contexts/AuthContext";

const ViewingCheck = () => {
  const { data: matches } = useGetViewingMatches();
  const { user } = useAuth();
  const { mutate: mutateViewingCheck, isPending: isViewingCheckPending } = useInsertViewingCheck(user!.id);

  const pastMatches = matches.filter((match) => match.status === "PAST");
  const todayMatches = matches.filter((match) => match.status === "TODAY");
  const upcomingMatches = matches.filter((match) => match.status === "UPCOMING");

  return (
    <div className="mt-4 flex w-full flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-yds-b1 text-white">오늘 경기</h2>
        {todayMatches.length === 0 ? (
          <div className="rounded-lg card-navy-50 bg-background-tertiary text-yds-b3 text-white">
            오늘 경기는 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {todayMatches.map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between rounded-lg card-navy-50 bg-background-tertiary text-yds-b3 text-primary-90"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background-secondary">
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
                    <span className="text-yds-c1r text-white">
                      {match.match_date} · {match.home_away === "HOME" ? "홈" : "원정"} · vs {match.opponent_team_name}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isViewingCheckPending || match.has_viewing_check}
                  onClick={() => mutateViewingCheck(match.id)}
                  className="shrink-0 rounded-lg bg-[#e9be11] px-3 py-2 text-center text-yds-c1m disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {match.has_viewing_check ? "관람완료" : "관람체크"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-yds-b1 text-white">다가오는 경기</h2>
        {upcomingMatches.length === 0 ? (
          <div className="rounded-lg card-navy-50 bg-background-tertiary text-yds-b3 text-white">
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
                <div className="shrink-0 cursor-pointer rounded-lg bg-[#e9be11] px-3 py-2 text-center text-yds-c1m">
                  알람신청
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-yds-b1 text-white">지난 경기</h2>
        {pastMatches.length === 0 ? (
          <div className="rounded-lg card-navy-50 bg-background-tertiary text-yds-b3 text-white">
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background-secondary">
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
                <div
                  aria-disabled="true"
                  className="shrink-0 cursor-not-allowed rounded-lg bg-gray-700 px-3 py-2 text-center text-yds-c1m text-gray-400 opacity-70"
                >
                  {match.has_viewing_check ? "관람완료" : "미관람"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ViewingCheck;
