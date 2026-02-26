/**
 * 작성자: KYD
 * 기능: 하단 네비게이션 바 컴포넌트
 * 프로세스 설명: 모바일 웹 표준 하단 네비게이션 바, 아이콘만 표시
 */
import { useNavigationItems } from "@shared/hooks/use-navigation-items";

const BottomNavigationBar = () => {
  //SECTION HOOK호출 영역
  const { items } = useNavigationItems("bottom-nav-bar");
  //!SECTION HOOK호출 영역

  return (
    <nav className="layout-footer-height flex w-full items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            className="flex h-full flex-1 flex-col cursor-pointer items-center justify-center gap-1 "
            onClick={item.onClick}
            aria-label={item.id}
          >
            <Icon
              size={24}
              className='text-primary-100'
            />
            <span className="text-white text-yds-c1m">
             {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;
