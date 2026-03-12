import { HttpResponse, http } from "msw";

import ViewingCheckDummy from "@auth/auth-info/auth-info-quick-links/viewing-check/mocks/viewing-check-dummy.json";

export const ViewingCheckHandlers = [
  http.post("*/rest/v1/rpc/get_viewing_matches", ({ request }) => {
    console.log("MSW: get_viewing_matches RPC 요청 가로챔!", request.url);
    return HttpResponse.json(ViewingCheckDummy);
  }),
  http.post("*/rest/v1/rpc/insert_viewing_check", ({ request }) => {
    console.log("MSW: insert_viewing_check RPC 요청 가로챔!", request.url);
    // 실제 Supabase RPC는 boolean을 data로 반환하므로, 여기서는 true를 반환
    return HttpResponse.json(true);
  }),
];
