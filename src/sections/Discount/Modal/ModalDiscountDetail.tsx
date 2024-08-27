import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFTextFieldNumber,
} from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Card, Grid, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import config from "../../../configs";
import { PlusOutlined } from "@ant-design/icons";
import {
  categoriesProps,
  DiscountAdd,
  DiscountDetailProps,
  typeMapping,
} from "../../../models/discount";
import { ApiDiscount } from "../../../api/services/apiDiscount";
import ModalAddCategories from "./ModalAddCategoriesDisscount";

interface ModalBrand {
  open: boolean;
  handleClose: () => void;
  onAddSuccess?: (response: string) => void;
  DiscountData: DiscountDetailProps | undefined;
  onFetchApi: VoidFunction;
}

const ModalDiscountDetail: React.FC<ModalBrand> = ({
  open,
  handleClose,
  onAddSuccess,
  DiscountData,
  onFetchApi,
}) => {
  const { apiUpdateDiscount } = ApiDiscount();
  const [openAddCategories, setOpenAddCategories] = useState<boolean>(false);
  const [categories, setCategories] = useState<categoriesProps[]>([]);

  const DiscountSchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(1, "Tối thiểu 1 kí tự").trim(),
    type: Yup.string().required("bắt buộc"),
    value: Yup.number()
      .min(2, "Không thể nhỏ hơn 2")
      .max(20, "Không thể lớn hơn 20")
      .required(),
  });

  const defaultValues = {
    name: DiscountData?.name || "",
    type: DiscountData?.type || "",
    value: DiscountData?.value || 0,
  };

  const methods = useForm<DiscountAdd>({
    resolver: yupResolver(DiscountSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: DiscountAdd) => {
    try {
      if (!DiscountData) return;
      const params = {
        ...data,
        status: DiscountData?.status,
      };
      const response = await apiUpdateDiscount(DiscountData?.id, params);
      if (response.status === 200) {
        if (onAddSuccess) {
          onAddSuccess(config.AdminMessageNotice.UpdateDiscount);
        }
        reset();
      }
    } catch (error) {
      handleClose();
      toast.error(config.AdminMessageNotice.ErrorDiscount);
      console.error(error);
    }
  };

  const handleOpen = () => {
    setOpenAddCategories(!openAddCategories);
  };

  const handleCloseAddCate = () => {
    setOpenAddCategories(!openAddCategories);
  };

  const handleCloseSubmit = () => {
    handleClose();
    onFetchApi();
  };
  useEffect(() => {
    if (!DiscountData) return;
    setCategories(DiscountData?.categories);
  }, [DiscountData]);
  return (
    <Modal
      title="Cập nhật chương trình giảm giá"
      open={open}
      onCancel={handleClose}
      footer={[]}
      maskClosable={false}
      width={1300}
      style={{ top: 0 }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField
                  name="name"
                  label="Tên chương trình giảm giá"
                  autoFocus
                />
                <RHFSelect name="type" label="Loại hình giảm giá">
                  {typeMapping?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextFieldNumber
                  name="value"
                  type="number"
                  label="Phần trăm giảm"
                  autoFocus
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
              <Stack display="flex" direction="row" justifyContent="flex-end">
                <Button onClick={handleOpen} icon={<PlusOutlined />}>
                  Thêm loại máy giảm giá
                </Button>
              </Stack>
              <Typography variant="h5">Dòng máy được giảm giá: </Typography>
              {DiscountData?.categories?.map((category, idx) => (
                <Typography key={category.id}>
                  {idx + 1} : {category.name}
                </Typography>
              ))}
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      {openAddCategories && (
        <>
          <ModalAddCategories
            handleClose={handleCloseAddCate}
            open={openAddCategories}
            selectBefore={categories}
            handleCloseSubmit={handleCloseSubmit}
            idDiscount={DiscountData?.id}
          />
        </>
      )}
    </Modal>
  );
};

export default ModalDiscountDetail;
