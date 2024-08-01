import { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { FormProvider, RHFRadioGroup } from "../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Card, Grid, Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { GetTaskProps, StaffTaskProps } from "../../../models/task";
import { ApiTask } from "../../../api/services/apiTask";
import { LoadingButton } from "@mui/lab";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyPropsById } from "../../../models/warranty";
import CustomPagination from "../../../components/pagination/CustomPagination";

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

const { Search } = Input;
export default function ModalChangeStaffTask({
  TaskData,
  open,
  handleClose,
  onChangeSuccess,
}: ModalBrand) {
  const { apiUpdateTask, apiTaskStaff } = ApiTask();
  const { apiGetWarrantyById } = ApiWarranty();
  const rowPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  //search
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<StaffTaskProps[]>([]);
  const [warranty, setWarranty] = useState<WarrantyPropsById>();

  const fetchAccountUser = async () => {
    const response = await apiTaskStaff();
    if (response.status === 200) {
      setData(response.data);
    } else {
      toast.error(response.Error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    watch,
    formState: { isSubmitting },
  } = methods;

  const staffID = watch("accountId");

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
      toast.error("Có lỗi cập nhật nhiệm vụ");
      console.error(error);
    }
  };

  //radio
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
      title={`Đổi nhân viên cho nhiệm vụ có id: ${TaskData?.id ?? ""}`}
      open={open}
      onCancel={handleClose}
      footer={null}
      style={{ top: 50 }}
      width={1300}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
                <TextField
                  label="Nhân viên hiện tại"
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
}
