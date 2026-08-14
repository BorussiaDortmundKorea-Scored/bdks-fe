/**
 * 작성자: KYD
 * 기능: 선수 이적시장 카드 스켈레톤
 */
import TransferMarketWrapper from "@auth/auth-info/auth-info-quick-links/transfer-market/components/wrapper/transfer-market-wrapper";

const TransferMarketSkeleton = () => {
  return (
    <TransferMarketWrapper>
      <ul className="flex flex-col gap-2" data-testid="transfer-market-skeleton">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="bg-background-secondary flex flex-col gap-3 rounded-xl p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 animate-pulse rounded-full bg-primary-100/20" />
                <div className="h-4 w-24 animate-pulse rounded bg-primary-100/20" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-6 w-14 animate-pulse rounded-full bg-primary-100/20" />
                <div className="h-6 w-12 animate-pulse rounded-full bg-primary-100/20" />
              </div>
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-primary-100/20" />
            <div className="h-6 w-full animate-pulse rounded bg-primary-100/20" />
          </li>
        ))}
      </ul>
    </TransferMarketWrapper>
  );
};

export default TransferMarketSkeleton;
