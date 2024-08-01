import { axiosPublic } from "../axiosInstance";
import { TASK, TASK_ID, TASK_STAFF } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { DeliveryPropsPost } from "../../models/task";
import config from "../../configs";

export const ApiTask = () => {
  const [loading, setLoading] = useState(false);

  interface TaskProps {
    OrderId?: string;
    Type?: string;
  }
  const apiGetTask = async (params: TaskProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(TASK, { params });

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  interface TaskProps {
    OrderId?: string;
  }
  const apiGetTaskStaff = async (params: TaskProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(TASK, { params });

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiTaskStaff = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(TASK_STAFF);

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };
  return {
    apiGetTask,
    loading,
    apiCreateTask,
    apiUpdateTask,
    apiGetTaskStaff,
    apiTaskStaff,
  };
};
