/**
 * 작성자: KYD
 * 기능: 대회 추가 모달 컴포넌트
 * 프로세스 설명: 대회 종류(마스터)·시즌(마스터)을 드롭다운으로 선택해 대회 추가
 * 참고: yd-ui SelectBox는 option.value를 화면에 표시하므로 value에 "대회명"을 담고,
 *       제출 시 competition_types에서 name -> id 로 변환한다 (name은 UNIQUE).
 */
import { useMemo, useState } from "react";

import { Button, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useCreateCompetition } from "@admin/admin-competition/api/react-query-api/use-create-competition";
import { useGetAllCompetitionTypes } from "@admin/admin-competition/api/react-query-api/use-get-all-competition-types";
import { useGetAllSeasons } from "@admin/admin-competition/api/react-query-api/use-get-all-seasons";

interface IAdminCompetitionAddModal {
  onClose: () => void;
}

export const AdminCompetitionAddModal = ({ onClose }: IAdminCompetitionAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createCompetition, isPending: isCreating } = useCreateCompetition();
  const { data: competitionTypes = [] } = useGetAllCompetitionTypes();
  const { data: seasons = [] } = useGetAllSeasons();

  const [competitionTypeName, setCompetitionTypeName] = useState("");
  const [season, setSeason] = useState("");

  // value = 대회명(화면 표시), label = id(React key 전용)
  const typeOptions = useMemo(
    () => competitionTypes.map((type) => ({ label: type.id, value: type.name })),
    [competitionTypes],
  );
  const seasonOptions = useMemo(
    () => seasons.map((s) => ({ label: s, value: s })),
    [seasons],
  );

  const typeSelectBox = useSelectBox({
    options: typeOptions,
    value: competitionTypeName,
    onChange: (value) => setCompetitionTypeName(value),
  });
  const seasonSelectBox = useSelectBox({
    options: seasonOptions,
    value: season,
    onChange: (value) => setSeason(value),
  });
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleCreateCompetition = async () => {
    const competitionTypeId = competitionTypes.find((type) => type.name === competitionTypeName)?.id;
    if (!competitionTypeId) return;

    await createCompetition({ competition_type_id: competitionTypeId, season });
    handleClose();
  };

  const handleClose = () => {
    setCompetitionTypeName("");
    setSeason("");
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 대회 추가</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">대회 종류</label>
          <SelectBox selectBoxHook={typeSelectBox} size="full" label="대회 종류 선택" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">시즌</label>
          <SelectBox selectBoxHook={seasonSelectBox} size="full" label="시즌 선택" />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleCreateCompetition}
          disabled={!competitionTypeName || !season || isCreating}
        >
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
