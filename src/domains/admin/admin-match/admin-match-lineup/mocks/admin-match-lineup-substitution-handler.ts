/**
 * 작성자: KYD
 * 기능: 관리자 경기 라인업 교체 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminMatchLineupSubstitutionDummy from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-substitution-dummy.json";

export const AdminMatchLineupSubstitutionHandlers = [
  http.post("*/rest/v1/rpc/substitute_match_lineup", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! substitute_match_lineup", request.url);
    return HttpResponse.json(AdminMatchLineupSubstitutionDummy.success);
  }),
];
