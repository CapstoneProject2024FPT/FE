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
  Typography,
} from "@mui/material";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { CreateWarranty, WarrantyProps } from "../../../../models/warranty";
import { formatAddress, formatDateFunc } from "../../../../utils/fn";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../../api/services/apiWarranty";
import config from "../../../../configs";
import { ApiOrder } from "../../../../api/services/apiOrder";
import { useEffect, useState } from "react";
import { OrderProps } from "../../../../models/order";
import moment from "moment";

// _mock

// ----------------------------------------------------------------------

type Props = {
  warrantyData: WarrantyProps | undefined;
  open: boolean;
  onClose: VoidFunction;
};

interface NoteProps {
  description: string;
}

export default function ModalRequestDetail({
  warrantyData,
  open,
  onClose,
}: Props) {
  const { apiCreateRequestWaranty } = ApiWarranty();
  const { apiGetOrderId } = ApiOrder();

  const [orderDetail, setOrderDetail] = useState<OrderProps>();
  const createDate = moment();

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

  const fetchOrder = async () => {
    if (!warrantyData) return;
    const response = await apiGetOrderId(warrantyData.orderId);
    setOrderDetail(response.data);
  };

  const onSubmit = async (data: NoteProps) => {
    try {
      if (warrantyData) {
        const params: CreateWarranty = {
          accountId: warrantyData.customer.id,
          addressId: warrantyData.address.id,
          description: data.description,
          inventoryId: warrantyData.inventory.id,
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

  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết đơn bảo hành</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Typography>Ngày tạo đơn bảo hành:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {formatDateFunc.formatDate(createDate.toDate())}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Máy thuộc mã đơn hàng:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{orderDetail?.invoiceCode}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Tên chủ đơn:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{orderDetail?.userInfo?.fullName}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Ngày mua:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {" "}
                  {formatDateFunc.formatDate(orderDetail?.createDate)}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Địa chỉ:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {formatAddress(warrantyData?.address) || ""}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Mã máy:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{warrantyData?.inventory?.serialNumber}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Tên máy:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {warrantyData?.inventory?.machinery?.name}
                </Typography>
              </Grid>
            </Grid>

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
