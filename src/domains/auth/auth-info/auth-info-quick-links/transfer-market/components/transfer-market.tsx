/**
 * 작성자: KYD
 * 기능: 선수 이적시장 - 항공권 스타일 카드 리스트
 * 프로세스 설명: 1행(선수+방향/금액 칩), 2행(이동 경로 비행기 게이지), 3행(구분선+좋아요/싫어요)
 */
import { Plane, ThumbsDown, ThumbsUp } from "lucide-react";

import TransferMarketWrapper from "@auth/auth-info/auth-info-quick-links/transfer-market/components/wrapper/transfer-market-wrapper";
import { useGetTransfers } from "@auth/auth-info/auth-info-quick-links/transfer-market/api/react-query-api/use-get-transfers";
import { useToggleTransferReaction } from "@auth/auth-info/auth-info-quick-links/transfer-market/api/react-query-api/use-toggle-transfer-reaction";

import { formatEuroToMillion } from "@shared/utils/euro-utils";

const DORTMUND = "도르트문트";

// 이동 경로 엔드포인트 (클럽 이름)
const RouteEndpoint = ({ name }: { name: string }) => (
  <div className="flex w-24 shrink-0 flex-col items-center">
    <span className="text-yds-c1m w-full truncate text-center text-white/80">{name}</span>
  </div>
);

const TransferMarket = () => {
  const { data: transfers } = useGetTransfers();
  const { mutate: toggleReaction, isPending } = useToggleTransferReaction();

  return (
    <TransferMarketWrapper>
      <ul className="flex flex-col gap-2 px-0.5" data-testid="transfer-market-list">
        {transfers.map((transfer) => {
          const isIn = transfer.direction === "IN";
          const isLoan = transfer.transfer_type === "LOAN";
          const club = transfer.counterpart_club_name ?? "자유계약";

          // 선수 입장 이동 경로: 영입 = 상대팀 → 도르트문트 / 방출·임대 = 도르트문트 → 상대팀
          const originName = isIn ? club : DORTMUND;
          const destName = isIn ? DORTMUND : club;

          return (
            <li
              key={transfer.id}
              className={`flex flex-col gap-3 rounded-xl border p-3 ${
                isIn ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
              }`}
            >
              {/* 1행: 선수 + 방향/금액 칩 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-secondary-400)] ring-2 ring-[var(--color-secondary-50)]">
                    {transfer.head_profile_image_url ? (
                      <img
                        src={transfer.head_profile_image_url}
                        alt={transfer.player_name}
                        className="h-9 w-9 object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="text-yds-b1 truncate text-white">
                    {transfer.player_korean_name ?? transfer.player_name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`text-yds-c1m rounded-full px-2.5 py-1 font-medium ${
                      isIn ? "bg-green-500/25 text-green-200" : "bg-red-500/25 text-red-200"
                    }`}
                  >
                    {isLoan ? "임대" : isIn ? "영입" : "방출"}
                  </span>
                  <span className="text-yds-c1m rounded-full bg-white/10 px-2.5 py-1 text-white/90">
                    {formatEuroToMillion(transfer.euro_fee)}
                  </span>
                </div>
              </div>

              {/* 2행: 이동 경로 (비행기 게이지) */}
              <div className="flex items-center gap-2">
                <RouteEndpoint name={originName} />
                <div className="flex flex-1 items-center">
                  <div className="bg-primary-400 h-0.5 flex-1 rounded" />
                  <Plane size={18} className="text-primary-400 mx-1 shrink-0 rotate-45" />
                  <div className="bg-primary-50 h-0.5 flex-1 rounded" />
                </div>
                <RouteEndpoint name={destName} />
              </div>

              {/* 3행: 구분선 + 날짜 + 좋아요/싫어요 */}
              <div className="flex items-center justify-between border-t border-white/10 pt-2">
                <span className="text-yds-c1m text-white/40">{transfer.transfer_date ?? ""}</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleReaction({ transferId: transfer.id, reaction: "LIKE" })}
                    disabled={isPending}
                    aria-label="좋아요"
                    className={`text-yds-c1m flex cursor-pointer items-center gap-1 transition-colors ${
                      transfer.my_reaction === "LIKE" ? "text-green-400" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <ThumbsUp size={18} />
                    {transfer.like_count}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleReaction({ transferId: transfer.id, reaction: "DISLIKE" })}
                    disabled={isPending}
                    aria-label="싫어요"
                    className={`text-yds-c1m flex cursor-pointer items-center gap-1 transition-colors ${
                      transfer.my_reaction === "DISLIKE" ? "text-red-400" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <ThumbsDown size={18} />
                    {transfer.dislike_count}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </TransferMarketWrapper>
  );
};

export default TransferMarket;
