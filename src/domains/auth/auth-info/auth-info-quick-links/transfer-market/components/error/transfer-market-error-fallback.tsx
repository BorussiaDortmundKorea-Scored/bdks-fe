import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const TransferMarketErrorFallback = () => {
  return (
    <div
      data-testid="transfer-market-error"
      className="flex w-full flex-col items-center justify-center gap-3 py-10 text-center"
    >
      <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
      <h2 className="text-yds-s2 text-primary-100">이적 정보를 불러오는데 실패했습니다</h2>
      <p className="text-yds-b2 text-primary-100/60">잠시 후 다시 시도해주세요.</p>
    </div>
  );
};

export default TransferMarketErrorFallback;
