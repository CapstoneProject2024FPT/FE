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
import { Card, Stack } from "@mui/material";
import { toast } from "react-toastify";
import { staffProps, userModel } from "../../../../../models/UserData";
import { ApiAccount } from "../../../../../api/services/apiAccount";
import { RoleData } from "../../RoleData";

interface ModalUser {
  UserData: userModel | staffProps | undefined;
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: () => void;
}

interface changeProps {
  fullName: string;
  role: string;
}
const ModalChangeRole: React.FC<ModalUser> = ({
  UserData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const { apiUpdateRole } = ApiAccount();
  const RoleSchema = Yup.object().shape({
    fullName: Yup.string().required("bắt buộc").min(1, "Tối thiểu 1 kí tự"),
    role: Yup.string().required("bắt buộc"),
  });

  const defaultValues: changeProps = {
    fullName: UserData?.fullName || "",
    role: UserData?.role || "",
  };

  const methods = useForm<changeProps>({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: changeProps) => {
    try {
      if (UserData) {
        const param = {
          ...data,
          gender: UserData.gender,
          status: UserData.status,
        };
        const response = await apiUpdateRole(UserData.id, param);

        if (response.status === 200) {
          if (onUpdateSuccess) {
            onUpdateSuccess();
          }
        }
      }
      reset();
    } catch (error) {
      toast.error("Có lỗi trong quá trình cập nhât");
      handleClose();
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chi Tiết Loại Máy"
      open={open}
      onCancel={handleClose}
      footer={[]}
      style={{ top: 50 }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="fullName" label="Tên" autoFocus />
            <RHFSelect name="role" label="Chức vụ">
              {RoleData?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </RHFSelect>
          </Stack>
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

export default ModalChangeRole;
