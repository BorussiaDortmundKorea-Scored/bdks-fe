// domains/animal/api/animalApi.ts
import { axiosPublic } from "../../../shared/api/axiosPublic";
import { axiosAuth } from "../../auth/api/axiosAuth";

export interface IAnimal {
  id: string;
  name: string;
}

// 공개 데이터
export const getAnimals = async () => {
  const response = await axiosPublic.get<IAnimal[]>("/animal");
  return response.data;
};

// 로그인 필요 데이터
export const getMyProfile = () => axiosAuth.get("/profile");
