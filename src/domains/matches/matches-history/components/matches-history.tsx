import { useGetAllFinishMatchLists } from "../api/react-query-api/use-get-all-finish-match-lists";

/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
const MatchesHistory = () => {
  //SECTION HOOK호출 영역
  const finishMatchLists = useGetAllFinishMatchLists();

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  console.log(finishMatchLists);

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return <div>dd</div>;
};

export default MatchesHistory;
