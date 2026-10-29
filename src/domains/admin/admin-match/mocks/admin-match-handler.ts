/**
 * 작성자: KYD
 * 기능: 관리자 경기 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminMatchDummy from "@admin/admin-match/mocks/admin-match-dummy.json";

export const AdminMatchHandlers = [
  http.post("*/rest/v1/rpc/get_all_matches", () => {
    return HttpResponse.json(AdminMatchDummy);
  }),
];
