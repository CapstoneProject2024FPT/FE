import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Stack, Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { patternValidate } from "../../../utils/pattern";
import { CutomerApi } from "../../../api/services/apiUser";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

type FormValuesProps = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

interface passwordChange {
  currentPassword: string;
  newPassword: string;
}
export default function UserChangePassword() {
  const { ChangePassword } = CutomerApi();

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Mật khấu cũ là cần thiết"),
    newPassword: Yup.string()
      .min(6, "Tồi thiểu phải dc 6 kí tự")
      .max(19, "Tồi đa phải dc 19 kí tự")
      .required("Mật khấu mới là cần thiết")
      .matches(
        patternValidate.password,
        "Mật khẩu từ 7-19 kí tự, có tối thiểu một số, một chữ và một kí tự đặc biệt"
      ),
    confirmNewPassword: Yup.string()
      .required("Bắt buộc nhập")
      .oneOf([Yup.ref("newPassword")], "Phải giống với mật khẩu"),
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
      const params: passwordChange = {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      const response = await ChangePassword(id, params);
      console.log(response);
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField
            name="oldPassword"
            type="password"
            label="Mật khẩu cũ"
          />

          <RHFTextField
            name="newPassword"
            type="password"
            label="Mật khẩu mới"
          />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label="Nhập lại mật khẩu"
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Lưu Mật Khẩu
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
