/**
 * 작성자: KYD
 * 기능: 관람체크 띠부실 도감 UI
 * 프로세스 설명: 경기 목록을 카드형 도감으로 표시하며, 관람한 경기는 컬러로 활성화되고 미관람/미래 경기는 회색으로 표시
 */
import { useGetViewingMatches } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/react-query-api/use-get-viewing-matches";
import { useInsertViewingCheck } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/react-query-api/use-insert-viewing-check";
import { type IViewingMatch } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/viewing-check-api";
import ViewingCheckWrapper from "@auth/auth-info/auth-info-quick-links/viewing-check/components/wrapper/viewing-check-wrapper";
import { useAuth } from "@auth/contexts/AuthContext";

interface IViewingCardProps {
  match: IViewingMatch;
  index: number;
  onCheck?: (matchId: string) => void;
  isCheckPending?: boolean;
}

const ViewingCard = ({ match, onCheck, isCheckPending }: IViewingCardProps) => {
  const isViewed = match.has_viewing_check;
  const isCheckable = match.status === "TODAY" && !isViewed;

  const handleClick = () => {
    if (isCheckable && onCheck) {
      onCheck(match.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isCheckable || isCheckPending}
      className={`group relative flex flex-col overflow-hidden rounded-lg border-2 transition-all ${
        isViewed
          ? "border-primary-400 bg-background-tertiary"
          : isCheckable
            ? "border-primary-300 bg-background-tertiary"
            : "bg-background-tertiary border-black"
      } ${isCheckable ? "cursor-pointer active:scale-95" : "cursor-default"}`}
      aria-label={`${match.opponent_team_name} - ${isViewed ? "관람완료" : isCheckable ? "관람체크" : "미관람"}`}
    >
      {/* 팀 로고 이미지 */}
      <div className="flex aspect-square items-center justify-center">
        {match.opponent_team_logo_image_url ? (
          <img
            src={match.opponent_team_logo_image_url}
            alt={`${match.opponent_team_name} 로고`}
            className={`h-full w-full object-contain transition-all ${isViewed ? "" : "opacity-30 grayscale"}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`text-yds-b1 flex h-full w-full items-center justify-center rounded-full ${
              isViewed ? "bg-background-secondary text-primary-50" : "bg-background-secondary/50 text-primary-100"
            }`}
          >
            ?
          </div>
        )}
      </div>

      {/* 카드 하단 정보 */}
      <div className={`w-full pb-2 ${isViewed ? "text-white" : "text-black"}`}>
        <p className="text-yds-c1m truncate">{match.opponent_team_name}</p>
        <p className="text-yds-c2r truncate">
          {match.competition_name}&nbsp;
          {match.round_name}
        </p>
        <p className="text-yds-c2r truncate">{match.home_away}</p>
      </div>

      {/* 관람체크 가능 표시 (경기날짜가 오늘이고 아직 직관하지 않은 상황) */}
      {isCheckable && (
        <div className="absolute top-0 right-0">
          <div className="text-yds-c1r text-secondary-400 rounded-bl-lg bg-(--color-primary-400) px-1.5 py-0.5">
            직관체크
          </div>
        </div>
      )}

      {/* 관람완료 뱃지 */}
      {isViewed && (
        <div className="absolute top-0 right-0">
          <div className="text-yds-c1r text-secondary-400 rounded-bl-lg bg-(--color-primary-400) px-1.5 py-0.5">
            직관
          </div>
        </div>
      )}
    </button>
  );
};

const ViewingCheck = () => {
  //SECTION HOOK호출 영역
  const { data: matches } = useGetViewingMatches();
  const { user } = useAuth();
  const { mutate: mutateViewingCheck, isPending: isViewingCheckPending } = useInsertViewingCheck(user!.id);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const viewedCount = matches.filter((m) => m.has_viewing_check).length;
  const totalCount = matches.length;
  //!SECTION 상태값 영역

  return (
    <ViewingCheckWrapper>
      {/* 수집 현황 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-yds-b1 text-primary-50">직관 띠부띠부씰</h2>
        <span className="text-yds-b2 text-primary-100">
          <span className="text-primary-400">{viewedCount}</span> / {totalCount}
        </span>
      </div>

      {/* 진행률 바 */}
      <div className="bg-background-tertiary h-2 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-(--color-primary-400) transition-all duration-500"
          style={{ width: totalCount > 0 ? `${(viewedCount / totalCount) * 100}%` : "0%" }}
        />
      </div>

      {/* 도감 그리드 */}
      {matches.length === 0 ? (
        <div className="card-navy-50 bg-background-tertiary text-yds-b3 text-primary-50 rounded-lg py-10 text-center">
          등록된 경기가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2" data-testid="viewing-check-grid">
          {matches.map((match, index) => (
            <ViewingCard
              key={match.id}
              match={match}
              index={index}
              onCheck={(matchId) => mutateViewingCheck(matchId)}
              isCheckPending={isViewingCheckPending}
            />
          ))}
        </div>
      )}
    </ViewingCheckWrapper>
  );
};

export default ViewingCheck;
