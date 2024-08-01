import React from "react";
import { Modal } from "antd";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
//component
import { LoadingButton } from "@mui/lab";
import { Card, Grid, Stack } from "@mui/material";
import { toast } from "react-toastify";
import { ApiAccount } from "../../../../../api/services/apiAccount";
import { RoleData } from "../../RoleData";
import config from "../../../../../configs";

interface ModalUser {
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: () => void;
  role: string;
}

interface AddModal {
  fullName: string;
  password: string;
  username: string;
  phoneNumber: string;
  email: string;
  role: string;
}
const ModalAddEmployee: React.FC<ModalUser> = ({
  role,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const { apiCreateEmployee } = ApiAccount();
  const RoleSchema = Yup.object().shape({
    fullName: Yup.string().required("bắt buộc").min(1, "Tối thiểu 1 kí tự"),
    role: Yup.string().required("bắt buộc"),
    password: Yup.string().required("bắt buộc"),
    username: Yup.string().required("bắt buộc"),
    phoneNumber: Yup.string().required("bắt buộc"),
    email: Yup.string().required("bắt buộc"),
  });

  const defaultValues = {
    fullName: "",
    role: role || "",
    password: "",
    username: "",
    phoneNumber: "",
    email: "",
  };

  const methods = useForm<AddModal>({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: AddModal) => {
    try {
      const response = await apiCreateEmployee(data);

      if (response.status === 200) {
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }

      reset();
    } catch (error) {
      toast.error(config.AdminMessageNotice.AddEmployeeFailed);
      handleClose();
      console.error(error);
    }
  };
  return (
    <Modal
      title="Mẫu điền thông tin nhân viên"
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[]}
      width={1000}
      style={{ top: 50 }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <RHFTextField name="username" label="Tên tài khoản" autoFocus />
                <RHFTextField name="fullName" label="Tên" autoFocus />
                <RHFTextField name="email" label="Địa chỉ email" autoFocus />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <RHFTextField name="password" label="Mật khẩu" autoFocus />
                <RHFTextField
                  name="phoneNumber"
                  label="Số điện thoại"
                  autoFocus
                />
                <RHFSelect name="role" label="Chức vụ">
                  {RoleData?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
          </Grid>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              loading={isSubmitting}
              variant="outlined"
              type="submit"
              sx={{
                marginTop: "5px",
              }}
            >
              Lưu Thay đổi
            </LoadingButton>
          </div>
        </Card>
      </FormProvider>
    </Modal>
  );
};

export default ModalAddEmployee;
