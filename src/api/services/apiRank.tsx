import { axiosPublic } from "../axiosInstance";
import { RANK, RANK_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { rankProps } from "../../models/rank";

export const ApiRank = () => {
  const [loading, setLoading] = useState(false);

  const apiGetRank = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(RANK);

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Lỗi lấy dữ liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiUpdateRank = async (id: string, params: rankProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        RANK_ID.replace(":id", id),
        params
      );

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Lỗi lấy dữ liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiAddRank = async (params: rankProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(RANK, params);

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Lỗi lấy dữ liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiDeleteRank = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(RANK_ID.replace(":id", id));

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Lỗi lấy dữ liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  return { apiGetRank, loading, apiUpdateRank, apiAddRank, apiDeleteRank };
};
