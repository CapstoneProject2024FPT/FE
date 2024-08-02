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
import { OrderProps } from "../../../models/order";
import { Card, Grid, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ApiTask } from "../../../api/services/apiTask";
import { DeliveryPropsPost, StaffTaskProps } from "../../../models/task";
import config from "../../../configs";
import CustomPagination from "../../../components/pagination/CustomPagination";

//api

interface ModalOrder {
  OrderData: OrderProps | null;
  openTaskPopup: boolean;
  handleCLose: () => void;
  onCreateSuccess: (response: string) => void;
}

interface DeliveryProps {
  accountId: string;
}

const { Search } = Input;
const ModalDeliveryTask: React.FC<ModalOrder> = ({
  OrderData,
  openTaskPopup,
  handleCLose,
  onCreateSuccess,
}) => {
  const { apiCreateTask, apiTaskStaff } = ApiTask();

  //search
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<StaffTaskProps[]>([]);
  //paginate
  const rowPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    accountId: Yup.string().required("Chọn một nhân viên"),
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
      if (OrderData) {
        const params: DeliveryPropsPost = {
          accountId: data.accountId,
          status: "Process",
          orderId: OrderData.orderId,
          type: "Delivery",
        };
        const response = await apiCreateTask(params);
        if (response.status === 200) {
          if (onCreateSuccess) {
            onCreateSuccess(config.AdminMessageNotice.CreatTaskSuccess);
            reset();
          }
        } else {
          toast.error(response.Error);
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

  //paginate
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const lastIndex = rowPerPage * currentPage;
  const indexFirstStaff = lastIndex - rowPerPage;
  const currentStaff = filteredRows?.slice(indexFirstStaff, lastIndex);

  const radioOptions = currentStaff?.map((item) => ({
    label: item.staffName,
    value: item.staffId,
    taskStatusCount: item.taskStatusCount,
  }));
  return (
    <Modal
      title={`Chấp nhận đơn hàng mã ${OrderData?.invoiceCode}`}
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
                  value={OrderData?.invoiceCode}
                  label="Mã đơn hàng"
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
                {/* paginate  */}
                <CustomPagination
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  postsPerPage={rowPerPage}
                  totalPosts={data?.length}
                />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Modal>
  );
};

export default ModalDeliveryTask;
