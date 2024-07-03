import React from "react";
import { Modal } from "antd";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
import { toast } from "react-toastify";
import { ApiRank } from "../../../api/services/apiRank";

interface ModalRank {
  open: boolean;
  handleClose: () => void;
  onAddSuccess: (response: string) => void;
}

type RankProps = {
  name: string;
  range: number;
};

const ModalRankAdd: React.FC<ModalRank> = ({
  open,
  handleClose,
  onAddSuccess,
}) => {
  const { apiAddRank } = ApiRank();
  const RankSchema = Yup.object().shape({
    name: Yup.string().required("Bắt buộc"),
    range: Yup.number().required("Bắt buộc").moreThan(500, "Lớn hơn 500"),
  });

  const defaultValues: RankProps = {
    name: "",
    range: 0,
  };

  const methods = useForm<RankProps>({
    resolver: yupResolver(RankSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: RankProps) => {
    try {
      const response = await apiAddRank(data);

      if (response.status === 200) {
        onAddSuccess(response.data);
      } else {
        toast.error(response.Error);
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chi Tiết Loại Máy"
      open={open}
      onCancel={handleClose}
      footer={[]}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="name" label="Tên hạng" autoFocus />
            <RHFTextField name="range" label="Mức tiền" multiline />
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

export default ModalRankAdd;
