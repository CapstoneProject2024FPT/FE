import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { useState } from "react";
import LoginSnackbar from "./LoginSnackBar";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import UserData from "../../models/UserData";
import { AuthApi } from "../../api/services/apiAuth";
import { toast } from "react-toastify";
import { localStorageFunc } from "../../utils/localStoragefn";
import config from "../../configs";

interface LoginProps {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { apiLogin, loading } = AuthApi();
  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleClose = () => {
    console.log("Snackbar closed");
    setOpen(false);
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const loginData: LoginProps = { username, password };
    try {
      const response: UserData = await apiLogin(loginData);
      localStorageFunc.setLocalStorage("loginInfo", JSON.stringify(response));
      toast.success("login success");
      navigate(config.routes.home);
    } catch (error) {
      //   setOpen(true);
      setText("login fail");
      console.log(error);
    }
  };

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Card
          sx={{
            width: "30%",
            background: "rgba(245, 245, 245, 0.4)",
            backdropFilter: "blur(50px)",
            boxShadow: "0 0 10px rgba(0 , 0, 0, .2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="UserName"
                name="userName"
                value={username}
                onChange={handleUsernameChange}
                InputLabelProps={{
                  shrink: true,
                }}
                autoComplete="off"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handlePasswordChange}
                autoComplete="off"
              />
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size="0.9rem" /> : null}
              >
                {loading ? "Progress Sign In" : "Sign In"}
              </Button>
            </Box>
          </Box>
        </Card>
      </Grid>

      <LoginSnackbar open={open} handleClose={handleClose} text={text} />
    </>
  );
};

export default LoginForm;
