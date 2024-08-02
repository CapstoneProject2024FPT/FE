import { axiosPublic } from "../axiosInstance";
import { ADMIN_DASHBOARD, COUNTORDERS } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import config from "../../configs";

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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiGetCountOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(COUNTORDERS);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  return { apiGetData, loading, apiGetCountOrders };
};
