/**
 * 작성자: KYD
 * 기능: 관리자 이적 관리 컴포넌트 - 이적 CRUD
 * 프로세스 설명: 이적 목록 조회, 등록/수정/삭제 (선수·방향·유형·시즌·상대클럽)
 */
import { Button } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { ArrowLeftRight, Edit, Trash2 } from "lucide-react";

import type { ITransfer } from "@admin/admin-transfer/api/admin-transfer-api";
import { useDeleteTransfer } from "@admin/admin-transfer/api/react-query-api/use-delete-transfer";
import { useGetAllTransfersSuspense } from "@admin/admin-transfer/api/react-query-api/use-get-transfers-by-season-suspense";
import { AdminTransferAddModal } from "@admin/admin-transfer/components/modal/admin-transfer-add-modal";
import { AdminTransferEditModal } from "@admin/admin-transfer/components/modal/admin-transfer-edit-modal";
import { directionText, typeText } from "@admin/admin-transfer/constants/transfer-options";

import { formatEuroToMillion } from "@shared/utils/euro-utils";

const AdminTransfer = () => {
  //SECTION HOOK호출 영역
  const { data: transfers } = useGetAllTransfersSuspense();
  const { mutateAsync: deleteTransfer } = useDeleteTransfer();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleDeleteTransfer = (id: string) => {
    overlay.confirmDialog({
      title: "정말로 이 이적 기록을 삭제하시겠습니까?",
      onConfirm: async () => {
        await deleteTransfer(id);
      },
    });
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminTransferAddModal onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const handleOpenEditModal = (transfer: ITransfer) => {
    overlay.modalOpen({
      content: (onClose) => <AdminTransferEditModal transfer={transfer} onClose={onClose} />,
      config: { size: "sm" },
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">이적 관리</h2>
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2"
          aria-label="새 이적 추가"
        >
          <ArrowLeftRight size={20} />
          이적 추가
        </Button>
      </div>

      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full md:w-[911px]">
        <ColGroup>
          <Col className="w-[140px]" />
          <Col className="w-[80px]" />
          <Col className="w-[80px]" />
          <Col className="w-[150px]" />
          <Col className="w-[100px]" />
          <Col className="w-[110px]" />
          <Col className="w-[90px]" />
        </ColGroup>
        <THead>
          <Tr>
            <Th>선수</Th>
            <Th>방향</Th>
            <Th>유형</Th>
            <Th>상대클럽</Th>
            <Th>이적금액</Th>
            <Th>이적일</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {transfers.map((transfer) => (
            <Tr key={transfer.id}>
              <Td>{transfer.player_korean_name ?? transfer.player_name}</Td>
              <Td>{directionText(transfer.direction)}</Td>
              <Td>{typeText(transfer.transfer_type)}</Td>
              <Td>{transfer.counterpart_club_name ?? "-"}</Td>
              <Td>{formatEuroToMillion(transfer.euro_fee)}</Td>
              <Td>{transfer.transfer_date ?? "-"}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditModal(transfer)}
                    className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                    aria-label="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTransfer(transfer.id)}
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

export default AdminTransfer;
