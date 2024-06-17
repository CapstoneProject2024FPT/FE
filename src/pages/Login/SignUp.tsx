import React from "react";
import styles from "./SignIn.module.scss";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { patternValidate } from "../../utils/pattern";
import { Grid, Stack, Typography } from "@mui/material";
import { AuthApi } from "../../api/services/apiAuth";
import classNames from "classnames/bind";
import { RegisterData } from "../../models/UserData";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

interface SignUpForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullname: string;
}
const SignUpForm: React.FC = () => {
  const { apiRegister } = AuthApi();
  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    password: Yup.string()
      .required("bắt buộc")
      .min(8, "Tối thiểu 8 kí tự")
      .matches(
        patternValidate.password,
        "Độ dài từ 8 tới 19, cần có kí tự, số, kí tự đặc biệt"
      ),
    confirmPassword: Yup.string()
      .required("Bắt buộc")
      .oneOf([Yup.ref("password")], "Phải giống mật khẩu"),
    email: Yup.string()
      .required("Bắt buộc")
      .matches(patternValidate.email, "Phải đúng định dạng"),
    fullname: Yup.string().required("Bắt buộc").min(5, "Tối thiểu 5 kí tự"),
  });

  const defaultValues: SignUpForm = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullname: "",
  };

  const methods = useForm<SignUpForm>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: SignUpForm) => {
    try {
      const params: RegisterData = {
        username: data.username,
        password: data.password,
        email: data.email,
        fullname: data.fullname,
      };

      const response = await apiRegister(params);

      if (response.StatusCode === 400) {
        toast.error(response.Error);
      } else {
        toast.success("Đăng kí thành công");
        reset();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("form-container", "sign-up-container")}>
        <div className={cx("form")}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Tạo Tài Khoản
          </Typography>
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
          <span>hoặc tạo tài khoản mới</span>
          <Stack display="flex" direction="column" spacing={2} sx={{ mt: 3 }}>
            <RHFTextField
              name="fullname"
              label="Tên đầy đủ"
              sx={{
                width: "350px",
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box !important",
                },
              }}
              InputLabelProps={{ shrink: true }}
              placeholder="Tên của bạn"
            />
            <RHFTextField
              name="username"
              label="Tài khoản"
              sx={{
                width: "350px",
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box !important",
                },
              }}
              InputLabelProps={{ shrink: true }}
              placeholder="Nhập tài khoản"
            />
            <Grid container>
              <Grid item xs={6}>
                <RHFTextField
                  type="text"
                  name="password"
                  label="Mật khẩu"
                  sx={{
                    width: "170px",
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box !important",
                    },
                  }}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Nhập mật khẩu"
                />
              </Grid>
              <Grid item xs={6}>
                <RHFTextField
                  type="password"
                  name="confirmPassword"
                  label="Nhập lại mật khẩu"
                  sx={{
                    width: "170px",
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box !important",
                    },
                  }}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Nhập lại mật khẩu"
                />
              </Grid>
            </Grid>

            <RHFTextField
              name="email"
              label="Email"
              sx={{
                width: "350px",
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box !important",
                },
              }}
              InputLabelProps={{ shrink: true }}
              placeholder="Nhập email"
            />
          </Stack>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            sx={{
              mt: 2,
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
            Đăng kí
          </LoadingButton>
        </div>
      </div>
    </FormProvider>
  );
};

export default SignUpForm;
