import React, { useEffect, useState } from "react";
// form
import { Input, Modal } from "antd";
import { FormProvider, RHFRadioGroup } from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { toast } from "react-toastify";
//model
import { Card, Grid, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ApiTask } from "../../../api/services/apiTask";
import { DeliveryPropsPost, StaffTaskProps } from "../../../models/task";
import {
  WarrantyDetailProps,
  WarrantyPropsById,
} from "../../../models/warranty";
//api

interface ModalOrder {
  OrderData: WarrantyPropsById | undefined;
  openTaskPopup: boolean;
  handleCLose: () => void;
  onCreateSuccess: (response: string) => void;
}

interface DeliveryProps {
  accountId: string;
}

const { Search } = Input;
const ModalDeliveryTaskWarranty: React.FC<ModalOrder> = ({
  OrderData,
  openTaskPopup,
  handleCLose,
  onCreateSuccess,
}) => {
  const { apiCreateTask, apiTaskStaff } = ApiTask();

  //search
  const [query, setQuery] = useState<string>("");

  const [data, setData] = useState<StaffTaskProps[]>();

  const fetchAccountUser = async () => {
    const response = await apiTaskStaff();
    if (response.status === 200) {
      setData(response.data);
    } else {
      toast.error(response.Error);
    }
  };

  useEffect(() => {
    fetchAccountUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DeliverySchema = Yup.object().shape({
    accountId: Yup.string().required("bắt buộc"),
  });

  const defaultValues: DeliveryProps = {
    accountId: "",
  };

  const methods = useForm<DeliveryProps>({
    resolver: yupResolver(DeliverySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const staffID = watch("accountId");

  const onSubmit = async (data: DeliveryProps) => {
    try {
      if (OrderData && OrderData.warrantyDetail) {
        const firstNullAccount: WarrantyDetailProps | undefined =
          OrderData.warrantyDetail.find((detail) => detail.accountId === null);
        if (firstNullAccount) {
          const params: DeliveryPropsPost = {
            accountId: data.accountId,
            status: "Process",
            warrantyDetailId: firstNullAccount.id,
            type: "Warranty",
          };
          const response = await apiCreateTask(params);
          if (response.status === 200) {
            if (onCreateSuccess) {
              onCreateSuccess("Giao nhiệm vụ thành công");
              reset();
            }
          } else {
            toast.error("Xảy ra lỗi trong quá trình thêm");
          }
        }
      }
    } catch (error) {
      handleCLose();
      console.error(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredRows = data?.filter((item) =>
    item.staffName.toLowerCase().includes(query.toLocaleLowerCase())
  );

  const radioOptions = filteredRows?.map((item) => ({
    label: item.staffName,
    value: item.staffId,
    taskStatusCount: item.taskStatusCount,
  }));
  return (
    <Modal
      title="Chấp nhận đơn hàng"
      open={openTaskPopup}
      onOk={handleCLose}
      onCancel={handleCLose}
      footer={[]}
      width={1300}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  value={
                    OrderData?.type === "CustomerRequest"
                      ? "Yêu cầu bảo hành"
                      : "Định kì"
                  }
                  label="Loại bảo hành"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  value={OrderData?.inventory?.machinery?.name || ""}
                  label="Mã máy"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  value={OrderData?.inventory?.serialNumber || ""}
                  label="Tên máy"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Tên nhân viên"
                  value={
                    staffID &&
                    data?.find((item) => item.staffId === staffID)?.staffName
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
              <div
                style={{
                  display: " flex",
                  justifyContent: "flex-end",
                  marginTop: "5px",
                }}
              >
                <LoadingButton
                  loading={isSubmitting}
                  variant="outlined"
                  type="submit"
                >
                  Lưu
                </LoadingButton>
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack>
                <Search
                  placeholder="Nhập tên nhân viên"
                  onChange={handleSearch}
                  style={{ width: 200, marginBottom: 16 }}
                />

                {/* {radio} */}
                <RHFRadioGroup name="accountId" options={radioOptions || []} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Modal>
  );
};

export default ModalDeliveryTaskWarranty;
