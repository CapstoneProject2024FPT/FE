import * as Yup from "yup";
import { useSnackbar } from "notistack";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Stack, Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { patternValidate } from "../../../utils/pattern";

// ----------------------------------------------------------------------

type FormValuesProps = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Mật khấu mới là cần thiết"),
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
      .oneOf([Yup.ref("password")], "Phải giống với mật khẩu"),
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(data);
      reset();
      enqueueSnackbar("Update success!");
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
            label="Old Password"
          />

          <RHFTextField
            name="newPassword"
            type="password"
            label="New Password"
          />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label="Confirm New Password"
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
