import { axiosPublic } from "../axiosInstance";
import { STAFF, USER_BY_ROLE, USER_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import config from "../../configs";

export const ApiAccount = () => {
  const [loading, setLoading] = useState(false);

  interface getByRole {
    Role?: string;
  }
  const apiGetUserByRole = async (params: getByRole) => {
    setLoading(true);

    try {
      const response = await axiosPublic.get(USER_BY_ROLE, { params });

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

  const apiBanned = async (id: string) => {
    setLoading(true);

    try {
      const response = await axiosPublic.delete(USER_ID.replace(":id", id));

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

  interface unBannedProps {
    role: string;
    status: string;
    gender: string;
  }

  const apiUnbanned = async (id: string, params: unBannedProps) => {
    setLoading(true);

    try {
      const response = await axiosPublic.put(
        USER_ID.replace(":id", id),
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

  interface changeRoleProps {
    role: string;
    status: string;
    gender: string;
    fullName: string;
  }
  const apiUpdateRole = async (id: string, params: changeRoleProps) => {
    setLoading(true);

    try {
      const response = await axiosPublic.put(
        USER_ID.replace(":id", id),
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

  interface AddModal {
    fullName: string;
    password: string;
    username: string;
    phoneNumber: string;
    email: string;
    role: string;
  }

  const apiCreateEmployee = async (registerData: AddModal) => {
    try {
      const response = await axiosPublic.post(STAFF, registerData);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    }
  };
  return {
    loading,
    apiGetUserByRole,
    apiBanned,
    apiUnbanned,
    apiUpdateRole,
    apiCreateEmployee,
  };
};
