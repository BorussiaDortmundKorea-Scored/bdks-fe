import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type ICountryEntity } from "@shared/types/entities/country.entity";

export type ICountry = ICountryEntity;

export type ICreateCountryRequest = Pick<ICountryEntity, "name">;

export type IUpdateCountryRequest = Pick<ICountryEntity, "id" | "name">;

// 모든 국가 조회
export const getAllCountries = async (): Promise<ApiResponse<ICountry[]>> => {
  const { data, error } = (await supabase.rpc("get_all_countries")) as {
    data: ICountry[];
    error: PostgrestError | null;
  };
  return { data: data as ICountry[], error: error as PostgrestError };
};

// 국가 생성
export const createCountry = async (country: ICreateCountryRequest): Promise<ApiResponse<ICountry>> => {
  const { data, error } = (await supabase.rpc("insert_country", {
    country_name: country.name,
  })) as { data: ICountry; error: PostgrestError | null };

  return { data: data as ICountry, error: error as PostgrestError };
};

// 국가 수정
export const updateCountry = async (country: IUpdateCountryRequest): Promise<ApiResponse<ICountry>> => {
  const { data, error } = (await supabase.rpc("update_country", {
    p_country_id: country.id,
    p_country_name: country.name,
  })) as { data: ICountry; error: PostgrestError | null };

  return { data: data as ICountry, error: error as PostgrestError };
};

// 국가 삭제 (사용 중인 국가는 RPC에서 삭제 거부)
export const deleteCountry = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("delete_country", {
    p_country_id: id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};
