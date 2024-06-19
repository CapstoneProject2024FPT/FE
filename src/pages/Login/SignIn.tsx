import React from "react";
import styles from "./SignIn.module.scss";
import classNames from "classnames/bind";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Stack } from "@mui/material";
import { UserData } from "../../models/UserData";
import { AuthApi } from "../../api/services/apiAuth";
import { toast } from "react-toastify";
import { localStorageFunc } from "../../utils/localStoragefn";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import config from "../../configs";

const cx = classNames.bind(styles);

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { apiLogin } = AuthApi();
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    password: Yup.string().required("bắt buộc").min(8, "Tối thiểu 8 kí tự"),
  });

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

      console.log(response);

      if (response.status === 200) {
        localStorageFunc.setLocalStorage("loginInfo", JSON.stringify(response));
        setAuthUser(response.data);
        toast.success("Đăng nhập thành công");
        if (response?.data.role === "User") {
          navigate(config.routes.home);
        }
      }
      if (response.statusCode === 401) {
        toast.error(response.error || "Đăng nhập thất bại");
      }

      reset();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi trong quá trình đăng nhập");
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("form-container", "sign-in-container")}>
        <div className={cx("form")}>
          <h1>Đăng nhập</h1>
          <div className={cx("social-container")}>
            <a href="#" className={cx("social", "link")}>
              <FaFacebookF />
            </a>
            <a href="#" className={cx("social", "link")}>
              <FaGooglePlusG />
            </a>
            <a href="#" className={cx("social", "link")}>
              <FaLinkedinIn />
            </a>
          </div>
          <span>hoặc sử dụng tài khoản</span>
          <Stack display="flex" direction="column" spacing={2} sx={{ mt: 3 }}>
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
          <a href="#" className={cx("link")}>
            Quên Mật Khẩu
          </a>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            sx={{
              borderRadius: "20px",
              border: "1px solid #ff4b2b",
              backgroundColor: " #ff4b2b",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: " bold",
              padding: " 12px 45px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              transition: "transform 80ms ease-in",
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
