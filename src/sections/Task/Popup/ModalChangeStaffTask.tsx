import React, { useEffect, useState } from "react";
import { Modal } from "antd";
//form
import {
  FormProvider,
  RHFAutoCompleteUser,
} from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
//component
import { Card, Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { GetTaskProps } from "../../../models/task";
import { ApiTask } from "../../../api/services/apiTask";
import { LoadingButton } from "@mui/lab";
import { RoleType, staffProps } from "../../../models/UserData";
import { ApiAccount } from "../../../api/services/apiAccount";

interface ModalBrand {
  TaskData: GetTaskProps | null;
  open: boolean;
  handleClose: () => void;
  onChangeSuccess: (response: string) => void;
}

interface updateChangeProps {
  accountId: string;
  addressId: string;
}

interface updateField {
  accountId: string;
}
const ModalChangeStaffTask: React.FC<ModalBrand> = ({
  TaskData,
  open,
  handleClose,
  onChangeSuccess,
}) => {
  const { apiUpdateTask } = ApiTask();
  const { apiGetUserByRole } = ApiAccount();
  const [data, setData] = useState<staffProps[]>();

  const fetchAccountUser = async () => {
    const params = {
      Role: RoleType.TECHNICAL,
      size: 20,
    };
    const response = await apiGetUserByRole(params);
    if (response.status === 200) {
      setData(response.data.items);
    } else {
      toast.error(response.Error);
    }
  };

  useEffect(() => {
    fetchAccountUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RankSchema = Yup.object().shape({
    accountId: Yup.string().required("Bắt buộc"),
  });

  const defaultValues: updateField = {
    accountId: TaskData?.staff.id || "",
  };

  const methods = useForm<updateField>({
    resolver: yupResolver(RankSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: updateField) => {
    try {
      if (TaskData) {
        const params: updateChangeProps = {
          accountId: data.accountId,
          addressId: TaskData.address.id,
        };
        const response = await apiUpdateTask(TaskData.id, params);

        if (response.status === 200) {
          onChangeSuccess(response.data);
        } else {
          toast.error(response.Error);
        }
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      title={`Đổi nhân viên ${TaskData?.id ?? ""}`}
      open={open}
      onCancel={handleClose}
      footer={[]}
      style={{ top: 50 }}
      width={600}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Mã đơn hàng"
              value={TaskData?.order?.invoiceCode}
            />
            <RHFAutoCompleteUser
              name="accountId"
              label="Mức tiền"
              options={data || []}
            />
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
              Lưu
            </LoadingButton>
          </div>
        </Card>
      </FormProvider>
    </Modal>
  );
};

export default ModalChangeStaffTask;
