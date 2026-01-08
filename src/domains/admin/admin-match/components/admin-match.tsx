/**
 * 작성자: KYD
 * 기능: 경기 관리 컴포넌트 - 경기 CRUD 기능
 * 프로세스 설명: 경기 목록 조회, 생성, 수정, 삭제 기능 제공 및 라인업 관리 접근
 */
import { useNavigate } from "react-router-dom";

import { Button } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { Edit, FolderPlus, Trash2, Users } from "lucide-react";

import type { IMatch } from "@admin/admin-match/api/admin-match-api";
import { useDeleteMatch } from "@admin/admin-match/api/react-query-api/use-delete-match";
import { useGetAllMatchesSuspense } from "@admin/admin-match/api/react-query-api/use-get-all-matches-suspense";
import { AdminMatchAddModal } from "@admin/admin-match/components/modal/admin-match-add-modal";
import { AdminMatchEditModal } from "@admin/admin-match/components/modal/admin-match-edit-modal";

import { createAdminMatchLineupPath } from "@shared/constants/routes";

const AdminMatch = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: matches } = useGetAllMatchesSuspense();
  const { mutateAsync: deleteMatch } = useDeleteMatch();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleDeleteMatch = async (id: string) => {
    if (!confirm("정말로 이 경기를 삭제하시겠습니까?")) return;

    await deleteMatch(id);
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchAddModal onClose={onClose} />,
      config: { size: "lg" },
    });
  };

  const handleOpenEditModal = (match: IMatch) => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchEditModal match={match} onClose={onClose} />,
      config: { size: "lg" },
    });
  };

  const handleLineupManagement = (matchId: string) => {
    navigate(createAdminMatchLineupPath(matchId));
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">경기 관리</h2>
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2"
          aria-label="새 경기 추가"
        >
          <FolderPlus size={20} />
          경기 추가
        </Button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>경기일</Th>
            <Th>대회</Th>
            <Th>상대팀</Th>
            <Th>홈/어웨이</Th>
            <Th>스코어</Th>
            <Th>라운드</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {matches.map((match) => (
            <Tr key={match.id}>
              <Td>{match.match_date}</Td>
              <Td>{match.competition_name}</Td>
              <Td>{match.opponent_team_name}</Td>
              <Td>{match.home_away === "HOME" ? "홈" : "어웨이"}</Td>
              <Td>
                {match.our_score} : {match.opponent_score}
              </Td>
              <Td>{match.round_name}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLineupManagement(match.id);
                    }}
                    className="cursor-pointer rounded-md p-1 text-green-500 transition-colors hover:bg-green-500/20 hover:text-white"
                    aria-label="라인업 관리"
                  >
                    <Users size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditModal(match);
                    }}
                    className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                    aria-label="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMatch(match.id);
                    }}
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

export default AdminMatch;
