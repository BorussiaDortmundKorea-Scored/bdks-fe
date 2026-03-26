/**
 * 작성자: KYD
 * 기능: viewing-check 공통 레이아웃 래퍼
 * 프로세스 설명: 본체/스켈레톤/에러 컴포넌트가 공유하는 레이아웃 쉘
 */

const ViewingCheckWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4 flex w-full flex-col gap-6">{children}</div>;
};

export default ViewingCheckWrapper;
