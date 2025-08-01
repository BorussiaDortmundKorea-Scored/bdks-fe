// domains/animal/api/animalApi.ts
import { axiosPublic } from "../../../shared/api/axiosPublic";
import { axiosAuth } from "../../auth/api/axiosAuth";

// 공개 데이터
export const getAnimals = () => axiosPublic.get("/animal");

// 로그인 필요 데이터
export const getMyProfile = () => axiosAuth.get("/profile");
