import React from "react";
import Box from "@mui/material/Box";
import { Grid, Modal, Typography } from "@mui/material";
import { CutomerApi } from "../../../../api/services/apiUser";
import { userModel, userPropUpdate } from "../../../../models/UserData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { patternValidate } from "../../../../utils/pattern";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

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
    address: Yup.string().required("bắt buộc").min(15, "Tối thiểu 15 kí tự"),
    phoneNumber: Yup.string()
      .required("bắt buộc")
      .matches(
        patternValidate.phone,
        "Phải đúng số điện thoại, bắt đầu bằng 0 và đủ 10 số"
      ),
  });

  const defaultValues: userPropUpdate = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    address: user?.address || "",
    phoneNumber: user?.phoneNumber || "",
  };

  const methods = useForm<userPropUpdate>({
    resolver: yupResolver(userProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
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

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
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
            <Grid item xs={12}>
              <LabelStyle>Địa chỉ email</LabelStyle>
              <RHFTextField
                required
                name="email"
                placeholder="email@gmail.com"
              />
            </Grid>
            <Grid item xs={12}>
              <LabelStyle>Địa chỉ</LabelStyle>
              <RHFTextField name="address" required multiline rows={2} />
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
