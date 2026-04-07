/**
 * 작성자: KYD
 * 기능: 보돌코 스코어드 라우터
 * 프로세스 설명: 로그인 권한별 라우팅 처리 완료, 어드민 페이지 접근 권한 처리 예정
 */
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFoundPage from "../pages/not-found-page";

import AdminRoute from "@admin/provider/admin-route";

import AuthProfileRoute from "@auth/auth-profile/provider/auth-profile-route";
import { AuthProvider } from "@auth/contexts/AuthContext";
import AuthRoute from "@auth/provider/auth-route";

import DashboardPage from "@dashboard/pages/dashboard-page";

import { ROUTES } from "@shared/constants/routes";
import PublicRoute from "@shared/provider/public-route";

import Ga4PageViewTracker from "./ga4-page-view-tracker";

//SECTION Lazy Loading 페이지 - 청크 분할
// 퍼블릭
const LoginPage = lazy(() => import("@auth/pages/login-page"));

// 프로필 설정
const AuthProfilePage = lazy(() => import("@auth/auth-profile/pages/auth-profile-page"));

// 일반 사용자 서브 페이지
const AuthInformationPage = lazy(() => import("@auth/auth-info/auth-information-page"));
const AuthInfoEditProfilePage = lazy(() => import("@auth/auth-info/auth-info-edit-profile/pages/auth-info-edit-profile-page"));
const ViewingCheckPage = lazy(() => import("@auth/auth-info/auth-info-quick-links/viewing-check/pages/viewing-check-page"));
const UserRankingPage = lazy(() => import("@auth/auth-info/auth-info-quick-links/user-ranking/pages/user-ranking-page"));
const AuthInfoDevContactPage = lazy(() => import("@auth/auth-info/auth-info-quick-links/auth-info-dev-contact/pages/auth-info-dev-contact-page"));

// 경기 관련
const MatchesHistoryPlayersRatingPage = lazy(() => import("@matches/matches-history/matches-history-players-rating/pages/matches-history-players-rating-page"));
const MatchesLastestPlayerRatingPage = lazy(() => import("@matches/matches-lastest/matches-lastest-player-rating/pages/matches-lastest-player-rating-page"));

// 선수 관련
const PlayerStatsPage = lazy(() => import("@players/players-stats/pages/player-stats-page"));

// 어드민
const AdminDashboardPage = lazy(() => import("@admin/admin-dashboard/admin-dashboard-page"));
const AdminUserPage = lazy(() => import("@admin/admin-user/pages/admin-user-page"));
const AdminPlayerPage = lazy(() => import("@admin/admin-player/pages/admin-player-page"));
const AdminMatchPage = lazy(() => import("@admin/admin-match/pages/admin-match-page"));
const AdminMatchLineupPage = lazy(() => import("@admin/admin-match/admin-match-lineup/pages/admin-match-lineup-page"));
const AdminTeamPage = lazy(() => import("@admin/admin-team/pages/admin-team-page"));
const AdminCompetitionPage = lazy(() => import("@admin/admin-competition/pages/admin-competition-page"));
//!SECTION Lazy Loading 페이지 - 청크 분할

const Router = () => {
  return (
    <BrowserRouter>
      <Ga4PageViewTracker />
      <AuthProvider>
        <Suspense>
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
            {/* 내 정보 */}
            <Route path={ROUTES.MY_INFO} element={<AuthInformationPage />} />
            <Route path={ROUTES.EDIT_PROFILE} element={<AuthInfoEditProfilePage />} />
            <Route path={ROUTES.VIEWING_CHECK} element={<ViewingCheckPage />} />
            <Route path={ROUTES.USER_RANKING} element={<UserRankingPage />} />

            {/* 메인 대시보드 */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* 선수 관련 */}
            <Route path={ROUTES.PLAYER_STATS} element={<PlayerStatsPage />} />

            {/* 경기 관련 */}
            <Route path={ROUTES.MATCH_RATINGS} element={<MatchesHistoryPlayersRatingPage />} />
            <Route path={ROUTES.MATCH_PLAYER_RATINGS} element={<MatchesLastestPlayerRatingPage />} />
            <Route path={ROUTES.DEV_CONTACT} element={<AuthInfoDevContactPage />} />

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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
