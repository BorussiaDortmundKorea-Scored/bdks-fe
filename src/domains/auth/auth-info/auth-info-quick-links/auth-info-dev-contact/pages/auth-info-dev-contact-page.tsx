import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import AuthInfoDevContact from "@auth/auth-info/auth-info-quick-links/auth-info-dev-contact/components/auth-info-dev-contact";


const options = {
  leftIcon: <BackButton />,
};

const AuthInfoDevContactPage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <AuthInfoDevContact />
    </div>
  );
};

export default AuthInfoDevContactPage;