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
  WarrantyDetailProps,
  WarrantyPropsById,
} from "../../../models/warranty";
import config from "../../../configs";
import CustomPagination from "../../../components/pagination/CustomPagination";
//api

//calender
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { viVN } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import CalendarComponent from "../../../components/calender/Calender";
import { formatDateFunc } from "../../../utils/fn";
import ModalAcceptDateWarranty from "./ModalAcceptDateWarranty";

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
  const { apiCreateTask, apiTaskStaff, apiGetTask } = ApiTask();

  //search
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<StaffTaskProps[]>([]);
  const rowPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tasks, setTasks] = useState<GetTaskProps[]>([]);

  const [dateExecution, setDateExecution] = useState<string | null>();
  const [selectedDateExecution, setSelectedDateExecution] = useState<
    string | null
  >();
  const [daySelect, setDaySelect] = useState<Dayjs | null>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDate, setTempDate] = useState<string | null>(null);
  const [selectedDateExecutionTemp, setSelectedDateExecutionTemp] = useState<
    string | null
  >();
  const [daySelectTemp, setDaySelectTemp] = useState<Dayjs | null>();

  const fetchAccountUser = async (executionDate = selectedDateExecution) => {
    if (!executionDate) return;
    const params = {
      targetDate: executionDate,
    };

    const response = await apiTaskStaff(params);
    if (response.status === 200) {
      setData(response.data);
    } else {
      toast.error(response.Error);
    }
  };

  console.log(dateExecution);

  useEffect(() => {
    if (!dateExecution) return;
    fetchAccountUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateExecution]);

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
    setValue,
    formState: { isSubmitting },
  } = methods;

  const staffID = watch("accountId");

  const onSubmit = async (data: DeliveryProps) => {
    try {
      if (OrderData && OrderData.warrantyDetail) {
        const firstNullAccount: WarrantyDetailProps | undefined =
          OrderData.warrantyDetail.find((detail) => detail.accountId === null);
        if (firstNullAccount) {
          if (!dateExecution) {
            toast.error("Chọn ngày thực hiện");
            return;
          }
          const params: DeliveryPropsPost = {
            accountId: data.accountId,
            warrantyDetailId: firstNullAccount.id,
            type: "Warranty",
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

  //get value and sort
  const sortOptions = filteredRows.sort((a, b) => {
    const processA = a.todayTaskStatusCount?.Process || 0;
    const processB = b.todayTaskStatusCount?.Process || 0;
    return processA - processB;
  });

  const lastIndex = rowPerPage * currentPage;
  const indexFirstStaff = lastIndex - rowPerPage;
  const currentStaff = sortOptions?.slice(indexFirstStaff, lastIndex);

  const radioOptions = currentStaff?.map((item) => ({
    label: item.staffName,
    value: item.staffId,
    taskStatusCount: item.todayTaskStatusCount,
  }));

  const fetchTaskStaff = async (id: string) => {
    if (!selectedDateExecution) return;
    const params = {
      Status: "Process",
      AccountId: id,
      ExcutionDate: selectedDateExecution,
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
      const dateCreate = OrderData?.createDate;
      const dateFilter = date.format("YYYY/MM/DD");
      setValue("accountId", "");
      setTasks([]);
      if (dateCreate) {
        const diffInBusinessDays = calculateBusinessDays(
          dayjs(dateCreate),
          dayjs(dateChoose)
        );

        if (diffInBusinessDays > 2) {
          setTempDate(dateChoose);
          setSelectedDateExecutionTemp(dateFilter);
          setDaySelectTemp(date);
          setIsModalOpen(true);
        } else {
          setDaySelect(date);
          setSelectedDateExecution(dateFilter);
          setDateExecution(dateChoose);
          fetchAccountUser(dateFilter);
        }
      } else {
        setDateExecution(dateChoose);
        setSelectedDateExecution(dateFilter);
        setDaySelect(date);
        fetchAccountUser(dateFilter);
      }
    }
  };

  //count date
  const calculateBusinessDays = (startDate: Dayjs, endDate: Dayjs): number => {
    let count = 0;
    let currentDate = startDate.startOf("day");

    while (currentDate.isBefore(endDate, "day")) {
      const dayOfWeek = currentDate.day();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate = currentDate.add(1, "day");
    }

    return count;
  };

  const handleConfirm = () => {
    setValue("accountId", "");
    setTasks([]);
    setDateExecution(tempDate);
    setSelectedDateExecution(selectedDateExecutionTemp);
    setDaySelect(daySelectTemp);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    // Reset the temporary states to null
    setTempDate(null);
    setSelectedDateExecutionTemp(null);
    setDaySelectTemp(null);
    setData([]);

    // Revert to previous date if any or clear it
    if (!dateExecution) {
      setDaySelect(null);
    }
  };

  return (
    <Modal
      title="Giao nhiệm vụ bảo hành theo yêu cầu"
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
                        : "Định kỳ"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Ngày tạo yêu cầu: </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography>
                      {OrderData?.startDate
                        ? formatDateFunc.formatDate(OrderData?.startDate)
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
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={
                    viVN.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    label={<CustomLabel label="Chọn ngày giao" />}
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
                <TextField
                  label={<CustomLabel label="Tên nhân viên" />}
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
        <CalendarComponent tasks={tasks} chooseDate={daySelect} />
        {isModalOpen && (
          <ModalAcceptDateWarranty
            openPopup={isModalOpen}
            handleClosePopup={handleCancel}
            onConfirm={handleConfirm}
          />
        )}
      </FormProvider>
    </Modal>
  );
};

interface CustomLabelProps {
  label: string;
}
const CustomLabel = ({ label }: CustomLabelProps) => (
  <Typography component="span">
    {label} <span style={{ color: "red" }}>*</span>
  </Typography>
);
export default ModalDeliveryTaskWarranty;
