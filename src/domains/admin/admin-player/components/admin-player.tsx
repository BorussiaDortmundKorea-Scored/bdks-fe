/**
 * 작성자: KYD
 * 기능: 선수 관리 컴포넌트 - 선수 CRUD + 현역/이적/은퇴 탭 + 이적·은퇴·복귀 처리 + 이미지 배경제거 도구 전환
 * 프로세스 설명: get_admin_players 의 status(최신 이적 기록 기준)로 탭별 선수를 나눠 보여준다.
 *              행의 작업 버튼으로 이적·은퇴·복귀 처리 모달과 이력 모달을 열고,
 *              헤더의 "이미지 배경제거" 버튼으로 배경제거 도구 화면으로 전환한다.
 */
import { useState } from "react";

import { Tabs } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { ArrowLeft, ArrowLeftRight, Edit, History, LogOut, RotateCcw, Trash2, UserPlus, Wand2 } from "lucide-react";

import AdminPlayerImageTool from "@admin/admin-player/admin-player-image-tool/components/admin-player-image-tool";
import type { IAdminPlayer, IPlayer, PlayerStatus } from "@admin/admin-player/api/admin-player-api";
import { useDeletePlayer } from "@admin/admin-player/api/react-query-api/use-delete-player";
import { useGetAdminPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-admin-players-suspense";
import AdminPlayerModalErrorFallback from "@admin/admin-player/components/error/admin-player-modal-error-fallback";
import { AdminPlayerAddModal } from "@admin/admin-player/components/modal/admin-player-add-modal";
import { AdminPlayerEditModal } from "@admin/admin-player/components/modal/admin-player-edit-modal";
import { AdminPlayerHistoryModal } from "@admin/admin-player/components/modal/admin-player-history-modal";
import AdminPlayerModalSkeleton from "@admin/admin-player/components/skeleton/admin-player-modal-skeleton";
import {
  AdminTransferAddModal,
  type PlayerTransferAction,
} from "@admin/admin-transfer/components/modal/admin-transfer-add-modal";

import { MODAL_SLOT_CONFIG } from "@shared/components/modal/modal-slot-config";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

type TabView = "players" | "transfers" | "retired";
type PlayerView = TabView | "imageTool";

const TAB_OPTIONS: { label: string; value: TabView }[] = [
  { label: "현역 선수", value: "players" },
  { label: "이적 선수", value: "transfers" },
  { label: "은퇴 선수", value: "retired" },
];

const TAB_STATUS: Record<TabView, PlayerStatus> = {
  players: "ACTIVE",
  transfers: "TRANSFERRED",
  retired: "RETIRED",
};

const EMPTY_MESSAGE: Record<TabView, string> = {
  players: "현역 선수가 없습니다.",
  transfers: "이적한 선수가 없습니다.",
  retired: "은퇴한 선수가 없습니다.",
};

/** 표 작업 칸 아이콘 버튼 — 관리자 화면 공통 모양 */
const ICON_BUTTON_CLASS =
  "text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white";
const DANGER_ICON_BUTTON_CLASS =
  "cursor-pointer rounded-md p-1 text-red-400 transition-colors hover:bg-red-500/20 hover:text-white";
const HEADER_BUTTON_CLASS =
  "text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white";

const isTabView = (value: string): value is TabView => TAB_OPTIONS.some((option) => option.value === value);

interface IAdminPlayerProps {
  initialView?: TabView;
}

const AdminPlayer = ({ initialView = "players" }: IAdminPlayerProps) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAdminPlayersSuspense();
  const { mutateAsync: deletePlayer } = useDeletePlayer();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [view, setView] = useState<PlayerView>(initialView);
  const visiblePlayers = view === "imageTool" ? [] : players.filter((player) => player.status === TAB_STATUS[view]);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleDeletePlayer = (id: string) => {
    overlay.confirmDialog({
      title: "정말로 이 선수를 삭제하시겠습니까?",
      onConfirm: async () => {
        await deletePlayer(id);
      },
    });
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminPlayerAddModal onClose={onClose} />,
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenEditModal = (player: IPlayer) => {
    overlay.modalOpen({
      content: (onClose) => <AdminPlayerEditModal player={player} onClose={onClose} />,
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenTransferModal = (player: IAdminPlayer, action: PlayerTransferAction) => {
    overlay.modalOpen({
      content: (onClose) => (
        <ReactQueryBoundary skeleton={<AdminPlayerModalSkeleton />} errorFallback={AdminPlayerModalErrorFallback}>
          <AdminTransferAddModal player={player} action={action} onClose={onClose} />
        </ReactQueryBoundary>
      ),
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenHistoryModal = (player: IAdminPlayer) => {
    overlay.modalOpen({
      content: (onClose) => (
        <ReactQueryBoundary
          skeleton={<AdminPlayerModalSkeleton rows={3} />}
          errorFallback={AdminPlayerModalErrorFallback}
        >
          <AdminPlayerHistoryModal player={player} onClose={onClose} />
        </ReactQueryBoundary>
      ),
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 — 높이 고정: 오른쪽 버튼은 현역 탭에만 있어, 높이가 따라 바뀌면 탭·표가 위아래로 움직인다 */}
      <div className="flex h-9 w-full shrink-0 items-center justify-between">
        <div className="flex items-center gap-3">
          {view === "imageTool" ? (
            <button
              type="button"
              onClick={() => setView("players")}
              className="text-primary-100 flex h-8 w-8 cursor-pointer items-center justify-center"
              aria-label="선수 목록으로 이동"
              title="선수 목록으로"
            >
              <ArrowLeft size={24} />
            </button>
          ) : null}
          <h2 className="text-yds-s1 text-primary-100">
            {view === "imageTool" ? "선수 이미지 배경제거" : "선수 관리"}
          </h2>
        </div>
        {view === "players" && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setView("imageTool")}
              className={HEADER_BUTTON_CLASS}
              aria-label="이미지 배경제거"
              title="이미지 배경제거"
            >
              <Wand2 size={20} />
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className={HEADER_BUTTON_CLASS}
              aria-label="새 선수 추가"
              title="선수 추가"
            >
              <UserPlus size={20} />
            </button>
          </div>
        )}
      </div>

      {view !== "imageTool" ? (
        <>
          <Tabs
            variant="underline"
            aria-label="선수 관리 보기"
            options={TAB_OPTIONS}
            value={view}
            onValueChange={(value: string) => {
              if (isTabView(value)) setView(value);
            }}
            className="mt-2"
          />
          {/* 스크롤 가능한 컨텐츠 영역 */}
          <Table
            scrollable={true}
            className="xl:w-full"
            scrollClassName="h-[760px] w-full [scrollbar-gutter:stable] xl:h-auto xl:min-h-0 xl:flex-1"
          >
            <ColGroup>
              <Col className="w-[160px]" />
              <Col className="w-[120px]" />
              <Col className="w-[80px]" />
              <Col className="w-[120px]" />
              <Col className="w-[110px]" />
              <Col className="w-[110px]" />
              <Col className="w-[200px]" />
            </ColGroup>
            <THead>
              <Tr>
                <Th sortable>영문 이름</Th>
                <Th sortable>이름</Th>
                <Th sortable>등번호</Th>
                <Th sortable>국적</Th>
                <Th>전신 이미지</Th>
                <Th>얼굴 이미지</Th>
                <Th>작업</Th>
              </Tr>
            </THead>
            <TBody>
              {visiblePlayers.length === 0 && (
                <Tr>
                  <Td colSpan={7}>
                    <p className="text-yds-b2 text-primary-100/60 py-10 text-center">{EMPTY_MESSAGE[view]}</p>
                  </Td>
                </Tr>
              )}
              {visiblePlayers.map((player) => (
                <Tr key={player.id}>
                  <Td>{player.name}</Td>
                  <Td>{player.korean_name || "-"}</Td>
                  <Td>{player.jersey_number || "-"}</Td>
                  <Td>{player.nationality || "-"}</Td>
                  <Td>
                    {player.full_profile_image_url ? (
                      <img
                        src={player.full_profile_image_url}
                        alt={`${player.name} 전신 이미지`}
                        className="h-24 w-auto object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </Td>
                  <Td>
                    {player.head_profile_image_url ? (
                      <img
                        src={player.head_profile_image_url}
                        alt={`${player.name} 얼굴 이미지`}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    ) : (
                      "-"
                    )}
                  </Td>
                  <Td className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {player.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleOpenTransferModal(player, "transfer")}
                          className={ICON_BUTTON_CLASS}
                          aria-label="이적 처리"
                          title="이적 처리"
                        >
                          <ArrowLeftRight size={16} />
                        </button>
                      )}
                      {player.status !== "RETIRED" && (
                        <button
                          type="button"
                          onClick={() => handleOpenTransferModal(player, "retire")}
                          className={ICON_BUTTON_CLASS}
                          aria-label="은퇴 처리"
                          title="은퇴 처리"
                        >
                          <LogOut size={16} />
                        </button>
                      )}
                      {player.status !== "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleOpenTransferModal(player, "return")}
                          className={ICON_BUTTON_CLASS}
                          aria-label="복귀 처리"
                          title="복귀 처리"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                      {player.status !== "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleOpenHistoryModal(player)}
                          className={ICON_BUTTON_CLASS}
                          aria-label="이적·은퇴 이력"
                          title="이적·은퇴 이력"
                        >
                          <History size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(player)}
                        className={ICON_BUTTON_CLASS}
                        aria-label="수정"
                        title="수정"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlayer(player.id)}
                        className={DANGER_ICON_BUTTON_CLASS}
                        aria-label="삭제"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4">
          <AdminPlayerImageTool />
        </div>
      )}
    </div>
  );
};

export default AdminPlayer;
