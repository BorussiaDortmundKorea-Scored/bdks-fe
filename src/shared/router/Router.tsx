/**
 * 작성자: KYD
 * 기능: 보돌코 스코어드 라우터
 * 프로세스 설명: 로그인 권한별 라우팅 처리 완료, 어드민 페이지 접근 권한 처리 예정
 */
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFoundPage from "../pages/not-found-page";
import Ga4PageViewTracker from "./ga4-page-view-tracker";

import AdminRoute from "@admin/provider/admin-route";

import AuthProfileRoute from "@auth/auth-profile/provider/auth-profile-route";
import { AuthProvider } from "@auth/contexts/AuthContext";
import AuthRoute from "@auth/provider/auth-route";

import DashboardPage from "@dashboard/pages/dashboard-page";

import PageLoading from "@shared/components/loading/page-loading";
import { ROUTES } from "@shared/constants/routes";
import PublicRoute from "@shared/provider/public-route";
import { lazyWithReload } from "@shared/utils/lazy-with-reload";

//SECTION Lazy Loading 페이지 - 청크 분할
// 퍼블릭
const LoginPage = lazyWithReload(() => import("@auth/pages/login-page"));

// 프로필 설정
const AuthProfilePage = lazyWithReload(() => import("@auth/auth-profile/pages/auth-profile-page"));

// 일반 사용자 서브 페이지
const AuthInformationPage = lazyWithReload(() => import("@auth/auth-info/auth-information-page"));
const AuthInfoEditProfilePage = lazyWithReload(
  () => import("@auth/auth-info/auth-info-edit-profile/pages/auth-info-edit-profile-page"),
);
const ViewingCheckPage = lazyWithReload(
  () => import("@auth/auth-info/auth-info-quick-links/viewing-check/pages/viewing-check-page"),
);
const UserRankingPage = lazyWithReload(
  () => import("@auth/auth-info/auth-info-quick-links/user-ranking/pages/user-ranking-page"),
);
const TransferMarketPage = lazyWithReload(
  () => import("@auth/auth-info/auth-info-quick-links/transfer-market/pages/transfer-market-page"),
);
const AuthInfoDevContactPage = lazyWithReload(
  () => import("@auth/auth-info/auth-info-quick-links/auth-info-dev-contact/pages/auth-info-dev-contact-page"),
);

// 경기 관련
const MatchesHistoryPlayersRatingPage = lazyWithReload(
  () => import("@matches/matches-history/matches-history-players-rating/pages/matches-history-players-rating-page"),
);
const MatchesLastestPlayerRatingPage = lazyWithReload(
  () => import("@matches/matches-lastest/matches-lastest-player-rating/pages/matches-lastest-player-rating-page"),
);

// 선수 관련
const PlayerStatsPage = lazyWithReload(() => import("@players/players-stats/pages/player-stats-page"));

// 어드민
const AdminDashboardPage = lazyWithReload(() => import("@admin/admin-dashboard/admin-dashboard-page"));
const AdminUserPage = lazyWithReload(() => import("@admin/admin-user/pages/admin-user-page"));
const AdminPlayerPage = lazyWithReload(() => import("@admin/admin-player/pages/admin-player-page"));
const AdminMatchPage = lazyWithReload(() => import("@admin/admin-match/pages/admin-match-page"));
const AdminMatchLineupPage = lazyWithReload(
  () => import("@admin/admin-match/admin-match-lineup/pages/admin-match-lineup-page"),
);
const AdminTeamPage = lazyWithReload(() => import("@admin/admin-team/pages/admin-team-page"));
const AdminCountryPage = lazyWithReload(() => import("@admin/admin-country/pages/admin-country-page"));
const AdminCompetitionPage = lazyWithReload(() => import("@admin/admin-competition/pages/admin-competition-page"));
const AdminTransferPage = lazyWithReload(() => import("@admin/admin-transfer/pages/admin-transfer-page"));
//!SECTION Lazy Loading 페이지 - 청크 분할

const Router = () => {
  return (
    <BrowserRouter>
      <Ga4PageViewTracker />
      <AuthProvider>
        <Suspense fallback={<PageLoading />}>
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
              <Route path={ROUTES.TRANSFER_MARKET} element={<TransferMarketPage />} />

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
                <Route path={ROUTES.ADMIN_COUNTRY} element={<AdminCountryPage />} />
                <Route path={ROUTES.ADMIN_COMPETITION} element={<AdminCompetitionPage />} />
                <Route path={ROUTES.ADMIN_TRANSFER} element={<AdminTransferPage />} />
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
