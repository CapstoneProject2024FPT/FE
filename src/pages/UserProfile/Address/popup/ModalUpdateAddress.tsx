/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// @types

// _mock

import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { addressProps, updateAddress } from "../../../../models/address";
import { ApiAddress } from "../../../../api/services/apiAddress";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  addressData: addressProps;
};

export default function ModalUpdateAddress({
  open,
  onClose,
  onSuccess,
  addressData,
}: Props) {
  const { apiUpdateAddress } = ApiAddress();
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Cần đặt tên cho địa chỉ").trim(),
    namePersonal: Yup.string().required("Cần tên người nhận").trim(),
    phoneNumber: Yup.string().required("Cần số điện thoại người nhận").trim(),
  });

  const defaultValues = {
    name: addressData?.name || "",
    namePersonal: addressData?.namePersonal || "",
    phoneNumber: addressData?.phoneNumber || "",
  };

  const methods = useForm<updateAddress>({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: updateAddress) => {
    try {
      if (addressData) {
        const params = {
          ...data,
          status: addressData.status,
        };
        const response = await apiUpdateAddress(addressData.id, params);
        if (response.status === 200) {
          if (onSuccess) onSuccess();
        } else if (response.StatusCode === 500) {
          toast.error(response.Error);
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      onClose();
      console.error(error);
    }
  };
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Cập nhật thông tin</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <RHFTextField name="name" label="Tên địa chỉ" />
            <RHFTextField name="namePersonal" label="Tên người nhận" />
            <RHFTextField name="phoneNumber" label="Số điện thoại" />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Huỷ
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Lưu thay đổi
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
