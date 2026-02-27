const AttendanceCheckSkeleton = () => {
  const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

  return (
    <div
      data-testid="attendance-check-skeleton"
      className="mt-4 flex w-full flex-col gap-3"
    >
      <ul className="flex flex-col gap-2">
        {skeletonItems.map((index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-lg card-navy-50 bg-background-tertiary p-3"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-background-secondary" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-40 animate-pulse rounded bg-primary-100/20" />
                <div className="h-3 w-52 animate-pulse rounded bg-primary-100/10" />
              </div>
            </div>
            <div className="h-8 w-20 animate-pulse rounded-lg bg-primary-100/20" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceCheckSkeleton;

