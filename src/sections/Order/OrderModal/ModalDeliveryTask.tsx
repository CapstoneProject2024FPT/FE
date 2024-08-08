/* eslint-disable react-hooks/exhaustive-deps */
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
import {
  DeliveryPropsPost,
  GetTaskProps,
  StaffTaskProps,
} from "../../../models/task";
import config from "../../../configs";
import CustomPagination from "../../../components/pagination/CustomPagination";

//calender
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { viVN } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import CalendarComponent from "../../../components/calender/Calender";
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
  const { apiCreateTask, apiTaskStaff, apiGetTask } = ApiTask();

  //search
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<StaffTaskProps[]>([]);
  //paginate
  const rowPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tasks, setTasks] = useState<GetTaskProps[]>([]);

  const [dateExecution, setDateExecution] = useState<string>();

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
        if (!dateExecution) {
          toast.error("Chọn ngày thực hiện");
          return;
        }
        const params: DeliveryPropsPost = {
          accountId: data.accountId,
          orderId: OrderData.orderId,
          type: "Delivery",
          excutionDate: dateExecution,
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

  const fetchTaskStaff = async (id: string) => {
    const params = {
      Status: "Process",
      AccountId: id,
    };
    const response = await apiGetTask(params);
    setTasks(response.data);
  };

  useEffect(() => {
    if (staffID) {
      fetchTaskStaff(staffID);
    }
  }, [staffID]);

  const handleChooseDate = (date: Dayjs | null) => {
    if (date) {
      const dateChoose = date.format();
      setDateExecution(dateChoose);
    }
  };

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
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={
                    viVN.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    label="Chọn ngày giao"
                    onChange={(e) => handleChooseDate(e)}
                    format="DD/MM/YYYY"
                    shouldDisableDate={(date) => {
                      const today = dayjs();
                      const isWeekend = date.day() === 0 || date.day() === 6;
                      return (
                        isWeekend || date.isBefore(today.add(1, "day"), "day")
                      );
                    }}
                  />
                </LocalizationProvider>
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
        <CalendarComponent tasks={tasks} />
      </FormProvider>
    </Modal>
  );
};

export default ModalDeliveryTask;
