import { RegisterData, UserData } from "../../models/UserData";
import { axiosPublic } from "../axiosInstance";
import { LOGIN, REGISTER } from "../pathApiName";
import { useState } from "react";

export const AuthApi = () => {
  const [loading, setLoading] = useState(false);

  const apiLogin = async (loginData: UserData) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(LOGIN, loginData);

      return response.data;
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const apiRegister = async (registerData: RegisterData) => {
    try {
      const response = await axiosPublic.post(REGISTER, registerData);
      return response;
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  return { apiLogin, apiRegister, loading };
};
