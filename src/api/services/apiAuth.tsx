import { AxiosResponse } from "axios";
import { axiosPublic } from "../axiosInstance";
import { LOGIN } from "../pathApiName";
import UserData from "../../models/UserData";
import { useState } from "react";
interface LoginProps {
  username: string;
  password: string;
}

interface RegisterProps {
  username: string;
  password: string;
}

export const AuthApi = () => {
  const [loading, setLoading] = useState(false);

  const apiLogin = async (loginData: LoginProps): Promise<UserData> => {
    setLoading(true);
    try {
      const response: AxiosResponse<UserData> = await axiosPublic.post(
        LOGIN,
        loginData
      );

      return response.data;
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const apiRegister = async (
    registerData: RegisterProps
  ): Promise<UserData> => {
    try {
      const response: AxiosResponse<UserData> = await axiosPublic.post(
        LOGIN,
        registerData
      );
      return response.data;
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  return { apiLogin, apiRegister, loading };
};
