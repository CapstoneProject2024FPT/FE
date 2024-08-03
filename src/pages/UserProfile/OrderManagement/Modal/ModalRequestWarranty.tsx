/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import {
  Box,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { CreateWarranty, Warranty } from "../../../../models/warranty";
import { formatAddress } from "../../../../utils/fn";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../../api/services/apiWarranty";
import config from "../../../../configs";

// _mock

// ----------------------------------------------------------------------

type Props = {
  warrantyData: Warranty | undefined;
  open: boolean;
  onClose: VoidFunction;
};

interface NoteProps {
  description: string;
}

export default function ModalRequestOrderDetail({
  warrantyData,
  open,
  onClose,
}: Props) {
  const { apiCreateRequestWaranty } = ApiWarranty();

  const RequestSchema = Yup.object().shape({
    description: Yup.string().required("bắt buộc").min(0, "Tối thiểu 5 kí tự"),
  });

  const defaultValues: NoteProps = {
    description: "",
  };

  const methods = useForm<NoteProps>({
    resolver: yupResolver(RequestSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: NoteProps) => {
    try {
      if (warrantyData) {
        const params: CreateWarranty = {
          accountId: warrantyData.warrantyDetails.customer.id,
          addressId: warrantyData.warrantyDetails.address.id,
          description: data.description,
          inventoryId: warrantyData.warrantyDetails.inventory.id,
        };

        const response = await apiCreateRequestWaranty(params);
        if (response.status === 200) {
          toast.success(config.MessageNotice.RequestWarrantySuccess);
          reset();
          onClose();
        } else {
          toast.error(response.Error);
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết đơn bảo hành</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Mã máy"
                  value={
                    warrantyData?.warrantyDetails?.inventory?.serialNumber || ""
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Tên máy"
                  value={
                    warrantyData?.warrantyDetails?.inventory?.machinery?.name ||
                    ""
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <TextField
                label="Địa chỉ bảo hành"
                value={
                  formatAddress(warrantyData?.warrantyDetails?.address) || ""
                }
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <RHFTextField
                label="Mô tả tình trạng máy"
                name="description"
                rows={3}
                multiline
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button variant="contained" onClick={onClose}>
            Đóng
          </Button>
          <LoadingButton
            variant="outlined"
            loading={isSubmitting}
            type="submit"
          >
            Đồng ý
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
