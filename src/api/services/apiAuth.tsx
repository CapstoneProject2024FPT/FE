import { RegisterData, UserData } from "../../models/UserData";
import { axiosPublic } from "../axiosInstance";
import { LOGIN, REGISTER } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

export const AuthApi = () => {
  const [loading, setLoading] = useState(false);

  const apiLogin = async (loginData: UserData) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(LOGIN, loginData);

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiRegister = async (registerData: RegisterData) => {
    try {
      const response = await axiosPublic.post(REGISTER, registerData);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Internal Server Error" };
      }
    }
  };

  return { apiLogin, apiRegister, loading };
};
