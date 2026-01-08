/**
 * 작성자: KYD
 * 기능: 선수 관리 컴포넌트 - 선수 CRUD 기능
 * 프로세스 설명: 선수 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { Button } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { Edit, FolderPlus, Trash2 } from "lucide-react";

import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { useDeletePlayer } from "@admin/admin-player/api/react-query-api/use-delete-player";
import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";
import { AdminPlayerAddModal } from "@admin/admin-player/components/modal/admin-player-add-modal";
import { AdminPlayerEditModal } from "@admin/admin-player/components/modal/admin-player-edit-modal";

const AdminPlayer = () => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { mutateAsync: deletePlayer } = useDeletePlayer();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleDeletePlayer = async (id: string) => {
    if (!confirm("정말로 이 선수를 삭제하시겠습니까?")) return;

    await deletePlayer(id);
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
        <h2 className="text-yds-s1 text-primary-100">선수 관리</h2>
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2"
          aria-label="새 선수 추가"
        >
          <FolderPlus size={20} />
          선수 추가
        </Button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>영문 이름</Th>
            <Th>이름</Th>
            <Th>등번호</Th>
            <Th>국적</Th>
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
    </div>
  );
};

export default AdminPlayer;
