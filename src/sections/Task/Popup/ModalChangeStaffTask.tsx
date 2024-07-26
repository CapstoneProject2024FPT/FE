import { useEffect, useState } from "react";
import { Modal } from "antd";
import {
  FormProvider,
  RHFAutoCompleteUser,
} from "../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Card, Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { GetTaskProps } from "../../../models/task";
import { ApiTask } from "../../../api/services/apiTask";
import { LoadingButton } from "@mui/lab";
import { RoleType, staffProps } from "../../../models/UserData";
import { ApiAccount } from "../../../api/services/apiAccount";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyPropsById } from "../../../models/warranty";

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

export default function ModalChangeStaffTask({
  TaskData,
  open,
  handleClose,
  onChangeSuccess,
}: ModalBrand) {
  const { apiUpdateTask } = ApiTask();
  const { apiGetUserByRole } = ApiAccount();
  const { apiGetWarrantyById } = ApiWarranty();

  const [data, setData] = useState<staffProps[]>();
  const [warranty, setWarranty] = useState<WarrantyPropsById>();

  const fetchAccountUser = async () => {
    const params = { Role: RoleType.TECHNICAL, size: 20 };
    try {
      const response = await apiGetUserByRole(params);
      if (response.status === 200) {
        setData(response.data.items);
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
      toast.error("Error fetching user data");
    }
  };

  const fetchWarrantyId = async (id: string) => {
    try {
      const response = await apiGetWarrantyById(id);
      if (response.status === 200) {
        setWarranty(response.data);
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
      toast.error("Error fetching warranty data");
    }
  };

  useEffect(() => {
    fetchAccountUser();
    if (TaskData?.warrantyDetail?.warrantyId) {
      fetchWarrantyId(TaskData.warrantyDetail.warrantyId);
    }
  }, [TaskData]);

  const RankSchema = Yup.object().shape({
    accountId: Yup.string().required("Required"),
  });

  const defaultValues: updateField = {
    accountId: TaskData?.staff?.id || "",
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
    if (!TaskData) return;

    const params: updateChangeProps = {
      accountId: data.accountId,
      addressId: TaskData.address.id,
    };

    try {
      const response = await apiUpdateTask(TaskData.id, params);
      if (response.status === 200) {
        onChangeSuccess(response.data);
      } else {
        toast.error(response.Error);
      }
      reset();
    } catch (error) {
      toast.error("Error updating task");
      console.error(error);
    }
  };

  return (
    <Modal
      title={`Đổi nhân viên cho nhiệm vụ có id: ${TaskData?.id ?? ""}`}
      open={open}
      onCancel={handleClose}
      footer={null}
      style={{ top: 50 }}
      width={600}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            {TaskData?.type === "Delivery" ? (
              <TextField
                label="Mã đơn hàng"
                value={TaskData?.order?.invoiceCode}
              />
            ) : (
              <>
                <TextField
                  label="Tên máy"
                  value={warranty?.inventory?.machinery?.name || ""}
                />
                <TextField
                  label="Mã số máy"
                  value={warranty?.inventory?.serialNumber || ""}
                />
              </>
            )}
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
              sx={{ marginTop: "5px" }}
            >
              Lưu
            </LoadingButton>
          </div>
        </Card>
      </FormProvider>
    </Modal>
  );
}
