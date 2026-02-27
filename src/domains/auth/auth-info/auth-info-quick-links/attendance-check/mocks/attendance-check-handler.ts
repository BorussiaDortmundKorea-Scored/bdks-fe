import { HttpResponse, http } from "msw";

import AttendanceCheckDummy from "@auth/auth-info/auth-info-quick-links/attendance-check/mocks/attendance-check-dummy.json";

export const AttendanceCheckHandlers = [
  http.post("*/rest/v1/rpc/get_attendance_matches", ({ request }) => {
    console.log("MSW: get_attendance_matches RPC 요청 가로챔!", request.url);
    return HttpResponse.json(AttendanceCheckDummy);
  }),
];

