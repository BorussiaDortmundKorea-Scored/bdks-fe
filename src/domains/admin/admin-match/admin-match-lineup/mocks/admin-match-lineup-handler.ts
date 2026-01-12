/**
 * 작성자: KYD
 * 기능: 관리자 경기 라인업 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminMatchLineupDummy from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-dummy.json";
import AdminMatchLineupPlayersDummy from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-players-dummy.json";
import AdminMatchLineupPositionsDummy from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-positions-dummy.json";

export const AdminMatchLineupHandlers = [
  http.post("*/rest/v1/rpc/get_match_lineups", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! get_match_lineups", request.url);
    return HttpResponse.json(AdminMatchLineupDummy);
  }),
  http.post("*/rest/v1/rpc/get_all_players", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! get_all_players", request.url);
    return HttpResponse.json(AdminMatchLineupPlayersDummy);
  }),
  http.post("*/rest/v1/rpc/get_all_positions", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! get_all_positions", request.url);
    return HttpResponse.json(AdminMatchLineupPositionsDummy);
  }),
  http.post("*/rest/v1/rpc/insert_match_lineup", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! insert_match_lineup", request.url);
    // 새로 생성된 라인업 반환 (첫 번째 더미 데이터 사용)
    return HttpResponse.json(AdminMatchLineupDummy[0]);
  }),
  http.post("*/rest/v1/rpc/update_match_lineup", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! update_match_lineup", request.url);
    // 업데이트된 라인업 반환 (첫 번째 더미 데이터 사용)
    return HttpResponse.json(AdminMatchLineupDummy[0]);
  }),
  http.post("*/rest/v1/rpc/bulk_insert_match_lineups", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! bulk_insert_match_lineups", request.url);
    // 일괄 생성된 라인업 목록 반환 (더미 데이터의 일부)
    return HttpResponse.json(AdminMatchLineupDummy);
  }),
];
