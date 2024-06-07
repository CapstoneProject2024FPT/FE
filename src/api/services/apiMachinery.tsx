import { AxiosResponse } from "axios";
import { axiosPrivate } from "../axiosInstance";
import { GET_MACHINERY } from "../pathApiName";
import UserData from "../../models/UserData";
import { useState } from "react";

interface GetListProps {
  name?: string;
  origin?: string;
  model?: string;
  description?: string;
  status?: string;
  serialNumber?: string;
  sellingPrice?: number;
  priority?: number;
  categoryId?: string;
}

export const MachineryApi = () => {
  const [loading, setLoading] = useState(false);
  const apiGetList = async (params: GetListProps): Promise<UserData[]> => {
    setLoading(true);
    try {
      const response: AxiosResponse<UserData[]> = await axiosPrivate.get(
        GET_MACHINERY,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };
  return { apiGetList, loading };
};