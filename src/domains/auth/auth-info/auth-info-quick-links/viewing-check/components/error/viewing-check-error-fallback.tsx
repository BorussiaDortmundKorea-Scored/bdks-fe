import ViewingCheckWrapper from "@auth/auth-info/auth-info-quick-links/viewing-check/components/wrapper/viewing-check-wrapper";

const ViewingCheckErrorFallback = () => {
  return (
    <ViewingCheckWrapper>
      <div
        data-testid="viewing-check-error"
        className="card-navy-50 flex w-full items-center justify-center rounded-lg bg-background-tertiary px-4 py-6 text-yds-c1m text-primary-100"
      >
        경기 정보를 불러오지 못했습니다. 다시 시도해 주세요.
      </div>
    </ViewingCheckWrapper>
  );
};

export default ViewingCheckErrorFallback;
