import React from "react";
import styles from "./SignIn.module.scss";
import classNames from "classnames/bind";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Stack } from "@mui/material";
import { UserData } from "../../models/UserData";
import { AuthApi } from "../../api/services/apiAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import config from "../../configs";
import { CustomerApi } from "../../api/services/apiUser";

const cx = classNames.bind(styles);

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const returnUrl = localStorage.getItem("historyPath");
  const { setAuthUser } = useAuthContext();
  const { apiLogin } = AuthApi();
  const { apiUserProfile } = CustomerApi();
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("bắt buộc").trim(),
    password: Yup.string().required("bắt buộc").trim(),
  });

  const role = ["Sale", "Admin", "Manager"];

  const defaultValues: UserData = {
    username: "",
    password: "",
  };

  const methods = useForm<UserData>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: UserData) => {
    try {
      const response = await apiLogin(data);
      if (response.status === 200) {
        localStorage.setItem("loginInfo", JSON.stringify(response));
        setAuthUser(response.data);
        const userInfo = await apiUserProfile(response.data.id);
        localStorage.setItem("getUserInfo", JSON.stringify(userInfo.data));

        if (response?.data.role === "User") {
          if (returnUrl) {
            toast.success(config.MessageNotice.loginSuccess);
            navigate(returnUrl);
          } else {
            toast.success(config.MessageNotice.loginSuccess);
            navigate(config.routes.home);
          }
        } else if (role.includes(response?.data?.role)) {
          toast.success(config.MessageNotice.loginSuccess);
          navigate(config.adminRoutes.dashboard);
        } else {
          setAuthUser(null);
          localStorage.removeItem("loginInfo");
          toast.error(config.MessageNotice.InvalidRole);
        }
      }
      if (response.statusCode === 401) {
        toast.error(response.error || config.MessageNotice.loginFailed2);
      }
      if (response.statusCode === 500) {
        toast.error(response.Error || config.MessageNotice.Error500);
      }

      reset();
    } catch (error) {
      console.error(error);
      toast.error(config.MessageNotice.loginFailed3);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("form-container", "sign-in-container")}>
        <div className={cx("form")} style={{ height: "100%" }}>
          <h1>Đăng nhập</h1>
          <Stack
            display="flex"
            direction="column"
            gap="20px"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <RHFTextField
              name="username"
              label="Tài khoản"
              sx={{
                width: "300px",
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box !important",
                },
              }}
              InputLabelProps={{ shrink: true }}
              placeholder="Nhập tài khoản"
            />
            <RHFTextField
              type="password"
              name="password"
              label="Mật khẩu"
              sx={{
                width: "300px",

                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box !important",
                },
              }}
              InputLabelProps={{ shrink: true }}
              placeholder="Nhập mật khẩu"
            />
          </Stack>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            sx={{
              mt: 2,
              borderRadius: "20px",
              border: "1px solid #0056b3",
              backgroundColor: " #0056b3",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: " bold",
              padding: " 12px 45px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              ":hover": {
                backgroundColor: "#0056b3",
                transform: "scale(1.2)",
                transition: "transform 100ms ease-out",
              },
            }}
          >
            Đăng Nhập
          </LoadingButton>
        </div>
      </div>
    </FormProvider>
  );
};

export default SignInForm;
