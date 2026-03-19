/**
 * 작성자: KYD
 * 기능: 관리자 경기 라인업 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminMatchLineupDummy from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-dummy.json";
import AdminMatchLineupPlayersDummy from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-players-dummy.json";
import AdminMatchLineupPositionsDummy from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-positions-dummy.json";

export const AdminMatchLineupHandlers = [
  http.post("*/rest/v1/rpc/get_match_lineups", () => {
    return HttpResponse.json(AdminMatchLineupDummy);
  }),
  http.post("*/rest/v1/rpc/get_all_players", () => {
    return HttpResponse.json(AdminMatchLineupPlayersDummy);
  }),
  http.post("*/rest/v1/rpc/get_all_positions", () => {
    return HttpResponse.json(AdminMatchLineupPositionsDummy);
  }),
  http.post("*/rest/v1/rpc/insert_match_lineup", () => {
    // 새로 생성된 라인업 반환 (첫 번째 더미 데이터 사용)
    return HttpResponse.json(AdminMatchLineupDummy[0]);
  }),
  http.post("*/rest/v1/rpc/update_match_lineup", () => {
    // 업데이트된 라인업 반환 (첫 번째 더미 데이터 사용)
    return HttpResponse.json(AdminMatchLineupDummy[0]);
  }),
  http.post("*/rest/v1/rpc/bulk_insert_match_lineups", () => {
    // 일괄 생성된 라인업 목록 반환 (더미 데이터의 일부)
    return HttpResponse.json(AdminMatchLineupDummy);
  }),
];
