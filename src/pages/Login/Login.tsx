import React, { useState } from "react";
import UserData from "../../models/UserData";
import apiLogin from "../../api/services/apiLogin";

const Login: React.FC = () => {
  interface LoginProps {
    username: string;
    password: string;
  }

  const [loginData, setLoginData] = useState<UserData | null>(null);

  const handleLogin = async (loginData: LoginProps): Promise<void> => {
    try {
      const userData: UserData = await apiLogin.login(loginData);
      setLoginData(userData);
      console.log("Login successful:", userData);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  console.log(loginData, handleLogin);

  return <div>Login</div>;
};

export default Login;
