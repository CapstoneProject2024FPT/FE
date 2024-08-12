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
import { Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ApiTask } from "../../../api/services/apiTask";
import {
  DeliveryPropsPost,
  GetTaskProps,
  StaffTaskProps,
} from "../../../models/task";
import {
  WarrantyDetailGetProps,
  WarrantyPropsById,
} from "../../../models/warranty";
import config from "../../../configs";
import CustomPagination from "../../../components/pagination/CustomPagination";
//api
//calender
import dayjs from "dayjs";
import CalendarComponent from "../../../components/calender/Calender";
import { formatDateFunc } from "../../../utils/fn";

interface ModalOrder {
  requestWarranty: WarrantyDetailGetProps | undefined;
  OrderData: WarrantyPropsById | undefined;
  idWarranty: string | undefined;
  openTaskPopup: boolean;
  handleCLose: () => void;
  onCreateSuccess: (response: string) => void;
}

interface DeliveryProps {
  accountId: string;
}

const { Search } = Input;
const ModalDeliveryTaskPeriodic: React.FC<ModalOrder> = ({
  OrderData,
  openTaskPopup,
  handleCLose,
  onCreateSuccess,
  idWarranty,
  requestWarranty,
}) => {
  const { apiCreateTask, apiTaskStaff, apiGetTask } = ApiTask();
  const [tasks, setTasks] = useState<GetTaskProps[]>([]);
  //search
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<StaffTaskProps[]>([]);
  const rowPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  //ngày di giao
  const executionDate = requestWarranty?.startDate;
  const chooseDate = dayjs(executionDate).format("YYYY-MM-DD");

  const fetchAccountUser = async () => {
    const params = {
      targetDate: chooseDate,
    };

    const response = await apiTaskStaff(params);
    if (response.status === 200) {
      setData(response.data);
    } else {
      toast.error(response.Error);
    }
  };

  useEffect(() => {
    if (!chooseDate) return;
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
        if (idWarranty) {
          if (!chooseDate) {
            toast.error("Chọn ngày thực hiện");
            return;
          }
          const params: DeliveryPropsPost = {
            accountId: data.accountId,
            warrantyDetailId: idWarranty,
            type: "Warranty",
            excutionDate: executionDate,
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

  //pagiante
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //get value and sort
  const sortOptions = filteredRows.sort((a, b) => {
    const processA = a.todayTaskStatusCount?.Process || 0;
    const processB = b.todayTaskStatusCount?.Process || 0;
    return processA - processB;
  });

  const lastIndexValue = currentPage * rowPerPage;
  const indexFirstValue = lastIndexValue - rowPerPage;
  const currentStaff = sortOptions?.slice(indexFirstValue, lastIndexValue);

  const radioOptions = currentStaff?.map((item) => ({
    label: item.staffName,
    value: item.staffId,
    taskStatusCount: item.todayTaskStatusCount,
  }));

  const fetchTaskStaff = async (id: string) => {
    const params = {
      Status: "Process",
      AccountId: id,
      ExcutionDate: chooseDate,
    };
    const response = await apiGetTask(params);
    setTasks(response.data);
  };

  useEffect(() => {
    if (staffID) {
      fetchTaskStaff(staffID);
    }
  }, [staffID]);

  return (
    <Modal
      title="Giao nhiệm vụ bảo hành định kì"
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
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Typography>Loại bảo hành: </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography>
                      {OrderData?.type === "CustomerRequest"
                        ? "Yêu cầu bảo hành"
                        : "Định kì"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Ngày thực hiện: </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography>
                      {requestWarranty?.startDate
                        ? formatDateFunc.formatDate(requestWarranty?.startDate)
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Mã máy: </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography>
                      {OrderData?.inventory?.serialNumber || ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography> Tên máy: </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography>
                      {OrderData?.inventory?.machinery?.name || ""}
                    </Typography>
                  </Grid>
                </Grid>
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
                <RHFRadioGroup
                  name="accountId"
                  options={radioOptions || []}
                  sx={{ height: "240px" }}
                />

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
        <Typography variant="h5">
          Tên nhân viên:{" "}
          {staffID && data?.find((item) => item.staffId === staffID)?.staffName}
        </Typography>
        <CalendarComponent tasks={tasks} chooseDate={executionDate} />
      </FormProvider>
    </Modal>
  );
};

export default ModalDeliveryTaskPeriodic;
