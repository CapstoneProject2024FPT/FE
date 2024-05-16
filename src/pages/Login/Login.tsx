import React from "react";
import "./Login.scss";
import LoginForm from "./LoginForm";
import { Box } from "@mui/material";
import images from "../../constants/images";

const Login: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${images.background})})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <LoginForm />
      </Box>
    </>
  );
};

export default Login;
