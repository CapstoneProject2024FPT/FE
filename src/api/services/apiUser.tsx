import { axiosPublic } from "../axiosInstance";
import { CUSTOMER_PROFILE } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { userPropUpdate } from "../../models/UserData";

export const CutomerApi = () => {
  const [loading, setLoading] = useState(false);

  const apiUserProfile = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        CUSTOMER_PROFILE.replace(":id", id)
      );

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

  const updateProfile = async (id: string, param: userPropUpdate) => {
    setLoading(true);

    try {
      const response = await axiosPublic.put(
        CUSTOMER_PROFILE.replace(":id", id),
        param
      );

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
  return { apiUserProfile, loading, updateProfile };
};
