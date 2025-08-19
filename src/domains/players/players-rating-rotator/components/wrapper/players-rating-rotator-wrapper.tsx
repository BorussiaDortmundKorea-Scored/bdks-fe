/**
 * 작성자: KYD
 * 기능: 에러,스켈레톤,구현 컴포넌트를 감싸는 컨테이너
 * 프로세스 설명:
 */
const PlayersRatingRotatorWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[clamp(320px,100vw,500px)] overflow-hidden p-4 text-lg text-white">{children}</div>;
};
export default PlayersRatingRotatorWrapper;
