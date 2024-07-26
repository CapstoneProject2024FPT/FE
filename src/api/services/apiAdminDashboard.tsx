import { axiosPublic } from "../axiosInstance";
import { ADMIN_DASHBOARD } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

export const ApiAdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  const apiGetData = async (query: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        `${ADMIN_DASHBOARD}?year=${query}`
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  return { apiGetData, loading };
};
