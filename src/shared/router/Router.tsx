/**
 * 작성자: KYD
 * 기능: 보돌코 스코어드 라우터
 * 프로세스 설명: 로그인 권한별 라우팅 처리 완료, 어드민 페이지 접근 권한 처리 예정
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import PublicRoute from "../components/PublicRoute";
import AuthRoute from "../components/AuthRoute";
import LoginPage from "../pages/auth/login-page";
import AdminPage from "../pages/admin/admin-page";
import PlayerRatingPage from "../pages/rating/player-rating-page";
import DashboardPage from "../pages/dashboard-page";
import MatchRatingListPage from "../pages/match/match-rating-list-page";
import PlayerStatsPage from "../pages/player/player-stats-page";
import NotFoundPage from "../pages/not-found-page";
import NicknamePage from "../pages/auth/nickname-page";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 퍼블릭 라우트 - 로그인하지 않은 사용자만 접근 */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
          </Route>

          {/* 프라이빗 라우트 - 로그인된 사용자만 접근 */}
          <Route element={<AuthRoute />}>
            {/* 닉네임 설정 */}
            <Route path="/nickname" element={<NicknamePage />} />

            {/* 메인 대시보드 */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 선수 관련 */}
            <Route path="/player/:playerId/rating" element={<PlayerRatingPage />} />
            <Route path="/player/:playerId/stats" element={<PlayerStatsPage />} />

            {/* 경기 관련 */}
            <Route path="/match/:matchId/ratings" element={<MatchRatingListPage />} />

            {/* 관리자 */}
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
