import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import { Card, Grid, Modal, Typography } from "@mui/material";
import { CutomerApi } from "../../../../api/services/apiUser";
import { userModel, userPropUpdate } from "../../../../models/UserData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../../components/hook-form";
import { patternValidate } from "../../../../utils/pattern";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import uploadImageToFirebase from "../../../../firebase/uploadImageToFirebase";

interface userData {
  open: boolean;
  handleClose: VoidFunction;
  user: userModel | undefined;
  onUpdateSuccess: (response: string) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
  p: 4,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const GENDER_OPTION = [
  {
    id: "Male",
    value: "Nam",
  },
  {
    id: "Female",
    value: "Nữ",
  },
];
const PopupUpdateUserProfile: React.FC<userData> = ({
  user,
  handleClose,
  open,
  onUpdateSuccess,
}) => {
  const userProfileSchema = Yup.object().shape({
    fullName: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    email: Yup.string()
      .required("bắt buộc")
      .matches(patternValidate.email, "Phải đúng định dạng email"),
    phoneNumber: Yup.string()
      .required("bắt buộc")
      .matches(
        patternValidate.phone,
        "Phải đúng số điện thoại, bắt đầu bằng 0 và đủ 10 số"
      ),
    image: Yup.string(),
    gender: Yup.string(),
  });

  const defaultValues: userPropUpdate = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    image:
      user?.image ||
      "https://firebasestorage.googleapis.com/v0/b/selling-maintainance-machinery.appspot.com/o/images%20(1).jfif?alt=media&token=5d70b7f3-d5c5-4de7-ba5a-767a328f9b82",
    gender: user?.gender || "",
  };

  const methods = useForm<userPropUpdate>({
    resolver: yupResolver(userProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { updateProfile } = CutomerApi();

  const onSubmit = async (data: userPropUpdate) => {
    try {
      const params = {
        ...data,
        role: user?.role,
        status: user?.status,
      };

      if (user) {
        const response = await updateProfile(user.id, params);

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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ textAlign: "center" }}>
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
                      <br /> tối đa 3.1mb
                    </Typography>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid item xs={12}>
                <LabelStyle>Họ và Tên</LabelStyle>
                <RHFTextField name="fullName" required />
              </Grid>
              <Grid item xs={12}>
                <LabelStyle>Số Điện Thoại</LabelStyle>
                <RHFTextField
                  name="phoneNumber"
                  placeholder="0963697057"
                  required
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <LabelStyle>Địa chỉ email</LabelStyle>
              <RHFTextField
                required
                name="email"
                placeholder="email@gmail.com"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LabelStyle>Giới tính</LabelStyle>
              <RHFSelect name="gender">
                {GENDER_OPTION.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.value}
                  </option>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                sx={{
                  backgroundColor: "#3498DB",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  width: "100%", // Full width button
                  marginTop: "10px",
                  "&:hover": {
                    backgroundColor: "rgba(125, 249, 255)", // Adjust the color as needed
                  },
                }}
              >
                Cập nhật
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default PopupUpdateUserProfile;
