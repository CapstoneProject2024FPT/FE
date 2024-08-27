import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
// @mui
import { Stack, Card, Typography, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { CustomerApi } from "../../../api/services/apiUser";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

type FormValuesProps = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

export default function UserChangePassword() {
  const { ChangePassword } = CustomerApi();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmNewPassword = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Mật khẩu cũ là cần thiết"),
    newPassword: Yup.string()
      .min(6, "Tối thiểu phải có 6 kí tự")
      .max(19, "Tối đa phải có 19 kí tự")
      .required("Mật khẩu mới là cần thiết"),
    confirmNewPassword: Yup.string()
      .required("Bắt buộc nhập")
      .oneOf([Yup.ref("newPassword")], "Phải giống với mật khẩu mới"),
  });

  const defaultValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const id: string = auth?.data.id;
      const params: PasswordChange = {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      const response = await ChangePassword(id, params);
      if (response.status === 200) {
        toast.success(response.data.message);
        reset();
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ marginBottom: "30px" }}>
        Thay đổi mật khẩu
      </Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <RHFTextField
            name="oldPassword"
            type={showOldPassword ? "text" : "password"}
            label="Mật khẩu cũ"
            InputProps={{
              style: { fontSize: "18px" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowOldPassword} edge="start">
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            label="Mật khẩu mới"
            InputProps={{
              style: { fontSize: "18px" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowNewPassword} edge="start">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmNewPassword"
            type={showConfirmNewPassword ? "text" : "password"}
            label="Nhập lại mật khẩu"
            InputProps={{
              style: { fontSize: "18px" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmNewPassword} edge="start">
                    {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Lưu Mật Khẩu
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
