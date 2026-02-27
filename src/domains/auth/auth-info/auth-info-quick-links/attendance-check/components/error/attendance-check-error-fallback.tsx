const AttendanceCheckErrorFallback = () => {
  return (
    <div
      data-testid="attendance-check-error"
      className="card-navy-50 flex h-full w-full items-center justify-center rounded-lg bg-background-tertiary px-4 py-6 text-yds-c1m text-primary-100"
    >
      경기 정보를 불러오지 못했습니다. 다시 시도해 주세요.
    </div>
  );
};

export default AttendanceCheckErrorFallback;

