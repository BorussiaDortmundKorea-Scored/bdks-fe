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
      className="text-primary-100 font-shilla-culture bg-background-tertiary text-yds-b1 card-navy-50 col-start-7 col-end-8 row-start-2 row-end-4 flex h-full w-full cursor-pointer items-center justify-center text-center"
      onClick={handleNavigateToDashboard}
    >
      <div className="mx-auto h-4/5 w-4/5">
        <img src={BDKS_LOGO} alt="BDKS Logo" className="w-full" />
        <span className="text-primary-100 text-yds-s1">바로가기</span>
      </div>
    </div>
  );
};

export default AdmiDashboardHome;
