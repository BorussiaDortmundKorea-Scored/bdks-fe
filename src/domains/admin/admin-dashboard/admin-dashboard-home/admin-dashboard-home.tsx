import { useNavigate } from "react-router-dom";

import { ROUTES } from "@shared/constants/routes";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

const BDKS_LOGO = `${SUPABASE_STORAGE_URL}/asset/logo.png`;

const AdmiDashboardHome = () => {
  const navigate = useNavigate();
  const handleNavigateToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };
  return (
    <div
      className="text-primary-100 font-shilla-culture bg-background-tertiary card-navy-50 flex h-[200px] w-[200px] cursor-pointer items-center justify-center text-center md:col-start-7 md:col-end-9 md:row-start-2 md:row-end-4 md:h-full md:w-full"
      onClick={handleNavigateToDashboard}
    >
      <div className="mx-auto flex h-4/5 w-4/5 flex-col items-center justify-center">
        <img src={BDKS_LOGO} alt="BDKS Logo" className="h-4/5 w-4/5" />
        <span className="text-primary-100 text-[24px] font-semibold">홈으로 이동</span>
      </div>
    </div>
  );
};

export default AdmiDashboardHome;
