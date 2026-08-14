import { HttpResponse, http } from "msw";

import TransferMarketDummy from "@auth/auth-info/auth-info-quick-links/transfer-market/mocks/transfer-market-dummy.json";

export const TransferMarketHandlers = [
  http.post("*/rest/v1/rpc/get_transfers", () => {
    return HttpResponse.json(TransferMarketDummy);
  }),
  http.post("*/rest/v1/rpc/toggle_transfer_reaction", () => {
    return HttpResponse.json([{ like_count: 1, dislike_count: 0, my_reaction: "LIKE" }]);
  }),
];
