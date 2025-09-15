/**
 * 작성자: KYD
 * 기능: 보돌코 스코어드 라우터
 * 프로세스 설명: 로그인 권한별 라우팅 처리 완료, 어드민 페이지 접근 권한 처리 예정
 */
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../../domains/auth/contexts/AuthContext";
import AuthRoute from "../../domains/auth/provider/AuthRoute";
import DashboardPage from "../../domains/dashboard/pages/dashboard-page";
import NicknameRoute from "../components/NicknameRoute";
import PublicRoute from "../components/PublicRoute";
import NicknamePage from "../pages/auth/nickname-page";
import MatchRatingListPage from "../pages/match/match-rating-list-page";
import NotFoundPage from "../pages/not-found-page";
import PlayerStatsPage from "../pages/player/player-stats-page";
import PlayerRatingPage from "../pages/rating/player-rating-page";

import LoginPage from "@auth/pages/login-page";

import MatchesLastestPlayerRatingPage from "@matches/matches-lastest/matches-lastest-player-rating/pages/matches-lastest-player-rating-page";

import AdminCompetitionPage from "@admin/admin-competition/pages/admin-competition-page";
import AdminMatchLineupPage from "@admin/admin-match/admin-match-lineup/pages/admin-match-lineup-page";
import AdminMatchPage from "@admin/admin-match/pages/admin-match-page";
import AdminPlayerPage from "@admin/admin-player/pages/admin-player-page";
import AdminTeamPage from "@admin/admin-team/pages/admin-team-page";
import AdminPage from "@admin/pages/admin-page";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 퍼블릭 라우트 - 로그인하지 않은 사용자만 접근 */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
          </Route>

          {/* 라우트 - 로그인 O, 닉네임 설정x 또는 닉네임 변경할 사용자만 접근*/}
          <Route element={<NicknameRoute />}>
            {/* 닉네임 설정 */}
            <Route path="/nickname" element={<NicknamePage />} />
          </Route>

          {/* 어스 라우트 - 로그인 O + 닉네임 설정O 사용자만 접근 */}
          <Route element={<AuthRoute />}>
            {/* 메인 대시보드 */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 선수 관련 */}
            <Route path="/player/:playerId/rating" element={<PlayerRatingPage />} />
            <Route path="/player/:playerId/stats" element={<PlayerStatsPage />} />

            {/* 경기 관련 */}
            <Route path="/match/:matchId/ratings" element={<MatchRatingListPage />} />
            <Route path="/match/:matchId/player/:playerId/ratings" element={<MatchesLastestPlayerRatingPage />} />

            {/* 관리자 */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/player" element={<AdminPlayerPage />} />
            <Route path="/admin/match" element={<AdminMatchPage />} />
            <Route path="/admin/match/:matchId/lineup" element={<AdminMatchLineupPage />} />
            <Route path="/admin/team" element={<AdminTeamPage />} />
            <Route path="/admin/competition" element={<AdminCompetitionPage />} />
          </Route>

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
