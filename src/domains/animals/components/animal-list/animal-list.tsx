/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useGetAnimal } from "@animals/api/react-query-api/useGetAnimal";
import React from "react";

interface IAnimalList {}

const AnimalList: React.FC<IAnimalList> = () => {
  //SECTION HOOK호출 영역
  const data = useGetAnimal();

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return <div>{data.map((animal) => animal.name)}</div>;
};

export default AnimalList;
