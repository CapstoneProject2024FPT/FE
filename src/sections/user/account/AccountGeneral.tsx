import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Resolver } from "react-hook-form";
// mockdata
import user from "./user.json";
//models
// components
import {
  FormProvider,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import { patternValidate } from "../../../utils/pattern";
import uploadImageToFirebase from "../../../firebase/uploadImageToFirebase";
import { staffModel } from "../../../models/UserData";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    fullName: Yup.string().required("Bắt buộc"),
    email: Yup.string().matches(patternValidate.email).required("Bắt buộc"),
    phoneNumber: Yup.string()
      .matches(patternValidate.phone, "Phải đúng số điện thoại")
      .required("Bắt buộc"),
    address: Yup.string().required("bắt buộc").min(10, "Tối thiểu 10 kí tự"),
    yearOfExperience: Yup.number().moreThan(0, "không thể nhỏ hơn 0"),
    photoURL: Yup.string().nullable(),
  });

  const defaultValues = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    photoURL: user?.photoUrl || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    yearOfExperience: user?.yearOfExperience || 0,
  };

  const methods = useForm<staffModel>({
    resolver: yupResolver(UpdateUserSchema) as Resolver<staffModel>,
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: staffModel) => {
    try {
      console.log(data);

      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar("Update success!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any[]) => {
      const file = acceptedFiles[0];

      const avatar = await uploadImageToFirebase(file);

      if (typeof avatar === "string") {
        setValue("photoURL", avatar);
      } else {
        console.error("Avatar is not a string:", avatar);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of 3.1mb
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField name="fullName" label="Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField
                name="yearOfExperience"
                label="Year Of Experience"
              />
              <RHFTextField name="address" label="Address" multiline />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
