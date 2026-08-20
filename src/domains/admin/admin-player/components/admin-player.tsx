/**
 * 작성자: KYD
 * 기능: 선수 관리 컴포넌트 - 선수 CRUD 기능 + 이미지 배경제거 도구 전환
 * 프로세스 설명: 선수 목록 조회/생성/수정/삭제, 헤더의 "이미지 배경제거" 버튼으로 배경제거 도구 화면 전환
 */
import { useState } from "react";

import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { ArrowLeft, Edit, Trash2, UserPlus, Wand2 } from "lucide-react";

import AdminPlayerImageTool from "@admin/admin-player/admin-player-image-tool/components/admin-player-image-tool";
import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { useDeletePlayer } from "@admin/admin-player/api/react-query-api/use-delete-player";
import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";
import { AdminPlayerAddModal } from "@admin/admin-player/components/modal/admin-player-add-modal";
import { AdminPlayerEditModal } from "@admin/admin-player/components/modal/admin-player-edit-modal";

type PlayerView = "table" | "imageTool";

const AdminPlayer = () => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { mutateAsync: deletePlayer } = useDeletePlayer();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [view, setView] = useState<PlayerView>("table");
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
    overlay.modalOpen({ content: (onClose) => <AdminPlayerAddModal onClose={onClose} />, config: { size: "sm" } });
  };

  const handleOpenEditModal = (player: IPlayer) => {
    overlay.modalOpen({
      content: (onClose) => <AdminPlayerEditModal player={player} onClose={onClose} />,
      config: { size: "sm" },
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {view === "imageTool" ? (
            <button
              type="button"
              onClick={() => setView("table")}
              className="text-primary-100 flex h-8 w-8 items-center justify-center"
              aria-label="선수 목록으로 이동"
              title="선수 목록으로"
            >
              <ArrowLeft size={24} />
            </button>
          ) : null}
          <h2 className="text-yds-s1 text-primary-100">{view === "table" ? "선수 관리" : "선수 이미지 배경제거"}</h2>
        </div>
        {view === "table" ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setView("imageTool")}
              className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
              aria-label="이미지 배경제거"
              title="이미지 배경제거"
            >
              <Wand2 size={20} />
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
              aria-label="새 선수 추가"
              title="선수 추가"
            >
              <UserPlus size={20} />
            </button>
          </div>
        ) : null}
      </div>

      {view === "table" ? (
        /* 스크롤 가능한 컨텐츠 영역 */
        <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full md:w-[1100px]">
          <ColGroup>
            <Col className="w-[160px]" />
            <Col className="w-[120px]" />
            <Col className="w-[80px]" />
            <Col className="w-[120px]" />
            <Col className="w-[110px]" />
            <Col className="w-[110px]" />
            <Col className="w-[100px]" />
          </ColGroup>
          <THead>
            <Tr>
              <Th>영문 이름</Th>
              <Th>이름</Th>
              <Th>등번호</Th>
              <Th>국적</Th>
              <Th>전신 이미지</Th>
              <Th>얼굴 이미지</Th>
              <Th>작업</Th>
            </Tr>
          </THead>
          <TBody>
            {players.map((player) => (
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
                <Td>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEditModal(player)}
                      className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                      aria-label="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player.id)}
                      className="cursor-pointer rounded-md p-1 text-red-400 transition-colors hover:bg-red-500/20 hover:text-white"
                      aria-label="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4">
          <AdminPlayerImageTool />
        </div>
      )}
    </div>
  );
};

export default AdminPlayer;
