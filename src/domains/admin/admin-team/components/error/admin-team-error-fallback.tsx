import { AlertTriangle } from "lucide-react";

const AdminTeamErrorFallback = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">팀 목록을 불러오는데 실패했습니다</h2>
        <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
      </div>
    </div>
  );
};

export default AdminTeamErrorFallback;
