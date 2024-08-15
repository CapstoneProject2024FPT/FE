import * as Yup from "yup";
import { useCallback } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack, Typography, Modal } from "@mui/material";
import { LoadingButton } from "@mui/lab";

//models
import { staffProps, staffUpdateProps } from "../../../../models/UserData";
// components
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../../components/hook-form";
import { patternValidate } from "../../../../utils/pattern";
import uploadImageToFirebase from "../../../../firebase/uploadImageToFirebase";

import { toast } from "react-toastify";
import { CustomerApi } from "../../../../api/services/apiUser";

// ----------------------------------------------------------------------

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
  p: 4,
};

const GENDER_OPTION = [
  {
    value: "Male",
    name: "Nam",
  },
  {
    value: "Female",
    name: "Nữ",
  },
];
interface userModal {
  open: boolean;
  userData: staffProps | undefined;
  handleClose: VoidFunction;
  onUpdateSuccess: (response: string) => void;
}
const UserEditForm: React.FC<userModal> = ({
  userData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const { updateProfile } = CustomerApi();

  const UpdateUserSchema = Yup.object().shape({
    fullName: Yup.string().required("Bắt buộc"),
    email: Yup.string().matches(patternValidate.email).required("Bắt buộc"),
    phoneNumber: Yup.string()
      .matches(patternValidate.phone, "Phải đúng số điện thoại")
      .required("Bắt buộc"),
    yearsOfExperience: Yup.number()
      .required("bắt buộc")
      .moreThan(0, "không thể nhỏ hơn 0"),
    image: Yup.string(),
    gender: Yup.string(),
  });

  const defaultValues: staffUpdateProps = {
    fullName: userData?.fullName || "",
    email: userData?.email || "Male",
    image:
      userData?.image ||
      "https://firebasestorage.googleapis.com/v0/b/selling-maintainance-machinery.appspot.com/o/images%20(1).jfif?alt=media&token=5d70b7f3-d5c5-4de7-ba5a-767a328f9b82",
    phoneNumber: userData?.phoneNumber || "",
    yearsOfExperience: userData?.yearsOfExperience || 0,
    gender: userData?.gender || "",
  };

  const methods = useForm<staffUpdateProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: staffUpdateProps) => {
    try {
      if (userData) {
        const params = {
          ...data,
          role: userData?.role,
          status: userData?.status,
        };
        console.log(params);

        const response = await updateProfile(userData.id, params);

        console.log(response);

        if (response.StatusCode === 400) {
          toast.error(response.Error);
          handleClose();
        } else {
          onUpdateSuccess(response.data);
        }
      }
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
        setValue("image", avatar);
      } else {
        console.error("Avatar is not a string:", avatar);
      }
    },
    [setValue]
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        overflow: "auto",
      }}
    >
      <Box sx={style}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
                <RHFUploadAvatar
                  name="image"
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
                      Cho phép *.jpeg, *.jpg, *.png, *.gif
                      <br /> tối đa of 3.1mb
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
                  <RHFTextField name="fullName" label="Tên" />
                  <RHFTextField name="email" label="Đia chỉ email" />
                  <RHFTextField name="phoneNumber" label="Số Điện Thoại" />
                  <RHFTextField
                    name="yearsOfExperience"
                    label="Kinh nghiệm"
                    type="number"
                  />
                  <RHFSelect name="gender" label="Giới tính">
                    {GENDER_OPTION.map((gender) => (
                      <option key={gender.value} value={gender.value}>
                        {gender.name}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
              </Card>
            </Grid>
          </Grid>
          <Stack
            spacing={3}
            display="flex"
            alignItems="flex-end"
            sx={{ mt: 3 }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Cập Nhật
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default UserEditForm;
