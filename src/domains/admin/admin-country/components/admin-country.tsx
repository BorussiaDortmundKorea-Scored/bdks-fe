/**
 * 작성자: KYD
 * 기능: 국가 관리 컴포넌트 - 국가 CRUD 기능
 * 프로세스 설명: 국가 목록 조회, 생성, 수정, 삭제 기능 제공 (팀 국가 드롭다운의 원천)
 */
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { Edit, Plus, Trash2 } from "lucide-react";

import type { ICountry } from "@admin/admin-country/api/admin-country-api";
import { useDeleteCountry } from "@admin/admin-country/api/react-query-api/use-delete-country";
import { useGetAllCountriesSuspense } from "@admin/admin-country/api/react-query-api/use-get-all-countries-suspense";
import { AdminCountryAddModal } from "@admin/admin-country/components/modal/admin-country-add-modal";
import { AdminCountryEditModal } from "@admin/admin-country/components/modal/admin-country-edit-modal";

const AdminCountry = () => {
  //SECTION HOOK호출 영역
  const { data: countries } = useGetAllCountriesSuspense();
  const { mutateAsync: deleteCountry } = useDeleteCountry();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleDeleteCountry = (id: string) => {
    overlay.confirmDialog({
      title: "정말로 이 국가를 삭제하시겠습니까?",
      description: "해당 국가를 사용하는 팀이 있으면 삭제할 수 없어요",
      onConfirm: async () => {
        await deleteCountry(id);
      },
    });
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminCountryAddModal onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const handleOpenEditModal = (country: ICountry) => {
    overlay.modalOpen({
      content: (onClose) => <AdminCountryEditModal country={country} onClose={onClose} />,
      config: { size: "sm" },
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">국가 관리</h2>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
          aria-label="새 국가 추가"
          title="국가 추가"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full md:w-[911px]">
        <ColGroup>
          <Col className="w-[280px]" />
          <Col className="w-[100px]" />
        </ColGroup>
        <THead>
          <Tr>
            <Th>국가명</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {countries.map((country) => (
            <Tr key={country.id}>
              <Td>{country.name}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditModal(country)}
                    className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                    aria-label="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCountry(country.id)}
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

export default AdminCountry;
