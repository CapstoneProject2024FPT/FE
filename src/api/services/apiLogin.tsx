import { AxiosResponse } from "axios";
import { axiosPublic } from "../axiosInstance";
import { LOGIN } from "../pathApiName";
import UserData from "../../models/UserData";

interface LoginProps {
  username: string;
  password: string;
}

const apiLogin = {
  login: async (loginData: LoginProps): Promise<UserData> => {
    try {
      const response: AxiosResponse<UserData> = await axiosPublic.post(
        LOGIN,
        loginData
      );
      return response.data;
    } catch (error) {
      throw new Error("Login failed");
    }
  },
};

export default apiLogin;
