/**
 * 작성자: KYD
 * 기능: 보돌코 스코어드 라우터
 * 프로세스 설명: 로그인 권한별 라우팅 처리 완료, 어드민 페이지 접근 권한 처리 예정
 */
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFoundPage from "../pages/not-found-page";
import PlayerStatsPage from "../pages/player/player-stats-page";

import AdminCompetitionPage from "@admin/admin-competition/pages/admin-competition-page";
import AdminDashboardPage from "@admin/admin-dashboard/admin-dashboard-page";
import AdminMatchLineupPage from "@admin/admin-match/admin-match-lineup/pages/admin-match-lineup-page";
import AdminMatchPage from "@admin/admin-match/pages/admin-match-page";
import AdminPlayerPage from "@admin/admin-player/pages/admin-player-page";
import AdminTeamPage from "@admin/admin-team/pages/admin-team-page";
import AdminUserPage from "@admin/admin-user/pages/admin-user-page";
import AdminRoute from "@admin/provider/admin-route";

import AuthProfilePage from "@auth/auth-profile/pages/auth-profile-page";
import AuthProfileRoute from "@auth/auth-profile/provider/auth-profile-route";
import { AuthProvider } from "@auth/contexts/AuthContext";
import LoginPage from "@auth/pages/login-page";
import AuthRoute from "@auth/provider/auth-route";

import DashboardPage from "@dashboard/pages/dashboard-page";

import MatchesHistoryPlayersRatingPage from "@matches/matches-history/matches-history-players-rating/pages/matches-history-players-rating-page";
import MatchesLastestPlayerRatingPage from "@matches/matches-lastest/matches-lastest-player-rating/pages/matches-lastest-player-rating-page";

import { ROUTES } from "@shared/constants/routes";
import PublicRoute from "@shared/provider/public-route";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 퍼블릭 라우트 - 로그인하지 않은 사용자만 접근 */}
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>

          {/* 라우트 - 로그인 O, 닉네임 설정x 또는 닉네임이 없는 초기 사용자만 접근*/}
          <Route element={<AuthProfileRoute />}>
            <Route path={ROUTES.AUTH_PROFILE} element={<AuthProfilePage />} />
          </Route>

          {/* 어스 라우트 - 로그인 O + 닉네임 설정O 사용자만 접근 */}
          <Route element={<AuthRoute />}>
            {/* 메인 대시보드 */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* 선수 관련 */}
            <Route path={ROUTES.PLAYER_STATS} element={<PlayerStatsPage />} />

            {/* 경기 관련 */}
            <Route path={ROUTES.MATCH_RATINGS} element={<MatchesHistoryPlayersRatingPage />} />
            <Route path={ROUTES.MATCH_PLAYER_RATINGS} element={<MatchesLastestPlayerRatingPage />} />

            {/* 관리자 전용 라우트 */}
            <Route element={<AdminRoute />}>
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={ROUTES.ADMIN_USER} element={<AdminUserPage />} />
              <Route path={ROUTES.ADMIN_PLAYER} element={<AdminPlayerPage />} />
              <Route path={ROUTES.ADMIN_MATCH} element={<AdminMatchPage />} />
              <Route path={ROUTES.ADMIN_MATCH_LINEUP} element={<AdminMatchLineupPage />} />
              <Route path={ROUTES.ADMIN_TEAM} element={<AdminTeamPage />} />
              <Route path={ROUTES.ADMIN_COMPETITION} element={<AdminCompetitionPage />} />
            </Route>
          </Route>

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
