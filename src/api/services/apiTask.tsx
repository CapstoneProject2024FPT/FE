import { axiosPublic } from "../axiosInstance";
import { TASK, TASK_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { DeliveryPropsPost } from "../../models/task";

export const ApiTask = () => {
  const [loading, setLoading] = useState(false);

  const apiGetTask = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(TASK);

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

  const apiCreateTask = async (params: DeliveryPropsPost) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(TASK, params);

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

  interface updateTaskProps {
    accountId: string;
    addressId: string;
  }
  const apiUpdateTask = async (id: string, params: updateTaskProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        TASK_ID.replace(":id", id),
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

  return { apiGetTask, loading, apiCreateTask, apiUpdateTask };
};
