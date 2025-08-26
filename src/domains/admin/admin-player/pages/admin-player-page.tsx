/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지 - 선수 CRUD 기능
 * 프로세스 설명: 선수 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";

import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { useCreatePlayer } from "@admin/admin-player/api/react-query-api/use-create-player";
import { useDeletePlayer } from "@admin/admin-player/api/react-query-api/use-delete-player";
import { useGetAllPlayers } from "@admin/admin-player/api/react-query-api/use-get-all-players";
import { useUpdatePlayer } from "@admin/admin-player/api/react-query-api/use-update-player";
import AdminWrapper from "@admin/provider/admin-wrapper";

const AdminPlayerPage = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: players = [], isLoading, error } = useGetAllPlayers();
  const createPlayerMutation = useCreatePlayer();
  const updatePlayerMutation = useUpdatePlayer();
  const deletePlayerMutation = useDeletePlayer();
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
    try {
      await createPlayerMutation.mutateAsync({
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
    } catch (error) {
      console.error("Failed to create player:", error);
    }
  };

  const handleUpdatePlayer = async () => {
    if (!editingPlayer) return;

    try {
      await updatePlayerMutation.mutateAsync({
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
    } catch (error) {
      console.error("Failed to update player:", error);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm("정말로 이 선수를 삭제하시겠습니까?")) return;

    try {
      await deletePlayerMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete player:", error);
    }
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

  if (isLoading) {
    return (
      <AdminWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">로딩 중...</div>
        </div>
      </AdminWrapper>
    );
  }

  if (error) {
    return (
      <AdminWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-500">에러가 발생했습니다: {error.message}</div>
        </div>
      </AdminWrapper>
    );
  }

  return (
    <AdminWrapper>
      <header className="w-full flex layout-header-height items-center relative">
        <ArrowLeft
          size={24}
          className="text-primary-400 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          선수 관리
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute right-4 bg-primary-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors"
          aria-label="새 선수 추가"
        >
          <Plus size={16} />
          추가
        </button>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    한국어 이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    국적
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.korean_name || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.jersey_number || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.nationality || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(player)}
                          className="text-indigo-600 hover:text-indigo-900"
                          aria-label="수정"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="text-red-600 hover:text-red-900"
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
        </div>
      </div>

      {/* 생성 모달 */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">새 선수 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="선수 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">한국어 이름</label>
                <input
                  type="text"
                  value={formData.korean_name}
                  onChange={(e) => setFormData({ ...formData, korean_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="한국어 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">등번호</label>
                <input
                  type="number"
                  value={formData.jersey_number}
                  onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="등번호를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">국적</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="국적을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전신 프로필 이미지 URL</label>
                <input
                  type="url"
                  value={formData.full_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, full_profile_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="전신 프로필 이미지 URL을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">얼굴 프로필 이미지 URL</label>
                <input
                  type="url"
                  value={formData.head_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, head_profile_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="얼굴 프로필 이미지 URL을 입력하세요"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCreatePlayer}
                disabled={!formData.name}
                className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 disabled:opacity-50"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">선수 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="선수 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">한국어 이름</label>
                <input
                  type="text"
                  value={formData.korean_name}
                  onChange={(e) => setFormData({ ...formData, korean_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="한국어 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">등번호</label>
                <input
                  type="number"
                  value={formData.jersey_number}
                  onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="등번호를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">국적</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="국적을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전신 프로필 이미지 URL</label>
                <input
                  type="url"
                  value={formData.full_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, full_profile_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="전신 프로필 이미지 URL을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">얼굴 프로필 이미지 URL</label>
                <input
                  type="url"
                  value={formData.head_profile_image_url}
                  onChange={(e) => setFormData({ ...formData, head_profile_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="얼굴 프로필 이미지 URL을 입력하세요"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditingPlayer(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdatePlayer}
                disabled={!formData.name}
                className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 disabled:opacity-50"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminWrapper>
  );
};

export default AdminPlayerPage;
