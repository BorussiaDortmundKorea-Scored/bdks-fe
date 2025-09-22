/**
 * 작성자: KYD
 * 기능: 선수 관리 컴포넌트 - 선수 CRUD 기능
 * 프로세스 설명: 선수 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input } from "@youngduck/yd-ui";
import { ArrowLeft, Edit, FolderPlus, Trash2 } from "lucide-react";

import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { useCreatePlayer } from "@admin/admin-player/api/react-query-api/use-create-player";
import { useDeletePlayer } from "@admin/admin-player/api/react-query-api/use-delete-player";
import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";
import { useUpdatePlayer } from "@admin/admin-player/api/react-query-api/use-update-player";

const AdminPlayer = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: players } = useGetAllPlayersSuspense();
  const { mutateAsync: createPlayer, isPending: isCreating } = useCreatePlayer();
  const { mutateAsync: updatePlayer, isPending: isUpdating } = useUpdatePlayer();
  const { mutateAsync: deletePlayer } = useDeletePlayer();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<IPlayer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    korean_name: "",
    jersey_number: "",
    nationality: "",
    full_profile_image_url: "",
    head_profile_image_url: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreatePlayer = async () => {
    await createPlayer({
      name: formData.name,
      korean_name: formData.korean_name || undefined,
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : undefined,
      nationality: formData.nationality || undefined,
      full_profile_image_url: formData.full_profile_image_url || undefined,
      head_profile_image_url: formData.head_profile_image_url || undefined,
    });
    setIsCreateModalOpen(false);
    setFormData({
      name: "",
      korean_name: "",
      jersey_number: "",
      nationality: "",
      full_profile_image_url: "",
      head_profile_image_url: "",
    });
  };

  const handleUpdatePlayer = async () => {
    if (!editingPlayer) return;

    await updatePlayer({
      id: editingPlayer.id,
      name: formData.name || undefined,
      korean_name: formData.korean_name || undefined,
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : undefined,
      nationality: formData.nationality || undefined,
      full_profile_image_url: formData.full_profile_image_url || undefined,
      head_profile_image_url: formData.head_profile_image_url || undefined,
    });
    setEditingPlayer(null);
    setFormData({
      name: "",
      korean_name: "",
      jersey_number: "",
      nationality: "",
      full_profile_image_url: "",
      head_profile_image_url: "",
    });
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm("정말로 이 선수를 삭제하시겠습니까?")) return;

    await deletePlayer(id);
  };

  const openEditModal = (player: IPlayer) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      korean_name: player.korean_name || "",
      jersey_number: player.jersey_number?.toString() || "",
      nationality: player.nationality || "",
      full_profile_image_url: player.full_profile_image_url || "",
      head_profile_image_url: player.head_profile_image_url || "",
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 고정된 헤더 */}
      <header className="layout-header-height bg-background-primary relative z-10 flex w-full shrink-0 items-center">
        <ArrowLeft
          size={24}
          className="text-primary-400 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          선수 관리
        </h1>
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute right-4 flex items-center gap-2"
          aria-label="새 선수 추가"
        >
          <FolderPlus size={20} />
          선수 추가
        </Button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="scrollbar-hide border-primary-100 my-4 flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border-2">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-primary-100 text-yds-b1 border-b-2">
            <tr className="h-12">
              <th className="px-6 text-left uppercase">이름</th>
              <th className="px-6 text-left uppercase">한국어 이름</th>
              <th className="px-6 text-left uppercase">등번호</th>
              <th className="px-6 text-left uppercase">국적</th>
              <th className="px-6 text-left uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-primary-100/5 h-12">
                <td className="text-primary-100 px-6 py-4 text-sm font-medium whitespace-nowrap">{player.name}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{player.korean_name || "-"}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{player.jersey_number || "-"}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{player.nationality || "-"}</td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(player)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 생성 모달 */}
      {isCreateModalOpen && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">새 선수 추가</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">이름</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="선수 이름을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">한국어 이름</label>
                <Input
                  type="text"
                  value={formData.korean_name}
                  onChange={(e) => setFormData({ ...formData, korean_name: e.target.value })}
                  placeholder="한국어 이름을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">등번호</label>
                <Input
                  type="number"
                  value={formData.jersey_number}
                  onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                  placeholder="등번호를 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">국적</label>
                <Input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="국적을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">전신 프로필 이미지 URL</label>
                <Input
                  type="url"
                  value={formData.full_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, full_profile_image_url: e.target.value })}
                  placeholder="전신 프로필 이미지 URL을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">얼굴 프로필 이미지 URL</label>
                <Input
                  type="url"
                  value={formData.head_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, head_profile_image_url: e.target.value })}
                  placeholder="얼굴 프로필 이미지 URL을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outlined" color="primary" size="full" onClick={() => setIsCreateModalOpen(false)}>
                취소
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleCreatePlayer}
                disabled={!formData.name || isCreating}
              >
                {isCreating ? "추가 중..." : "추가"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingPlayer && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">선수 수정</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">이름</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="선수 이름을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">한국어 이름</label>
                <Input
                  type="text"
                  value={formData.korean_name}
                  onChange={(e) => setFormData({ ...formData, korean_name: e.target.value })}
                  placeholder="한국어 이름을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">등번호</label>
                <Input
                  type="number"
                  value={formData.jersey_number}
                  onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                  placeholder="등번호를 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">국적</label>
                <Input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="국적을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">전신 프로필 이미지 URL</label>
                <Input
                  type="url"
                  value={formData.full_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, full_profile_image_url: e.target.value })}
                  placeholder="전신 프로필 이미지 URL을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">얼굴 프로필 이미지 URL</label>
                <Input
                  type="url"
                  value={formData.head_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, head_profile_image_url: e.target.value })}
                  placeholder="얼굴 프로필 이미지 URL을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outlined" color="primary" size="full" onClick={() => setEditingPlayer(null)}>
                취소
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleUpdatePlayer}
                disabled={!formData.name || isUpdating}
              >
                {isUpdating ? "수정 중..." : "수정"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayer;
