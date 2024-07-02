import { axiosPublic } from "../axiosInstance";
import { USER_BY_ROLE } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

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
        return { statusCode: 500, message: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, apiGetUserByRole };
};
