import React, { useState } from "react";
import UserData from "../../models/UserData";
import { apiLogin } from "../../api/services/apiAuth";

const Login: React.FC = () => {
  interface LoginProps {
    username: string;
    password: string;
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const loginData: LoginProps = { username, password };
    try {
      const response: UserData = await apiLogin(loginData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(handleLogin, handleUsernameChange, handlePasswordChange);

  return (
    <>
      <div>Login</div>
    </>
  );
};
export default Login;
