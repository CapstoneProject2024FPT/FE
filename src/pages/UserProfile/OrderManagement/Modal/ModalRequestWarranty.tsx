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
} from "@mui/material";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { CreateWarranty, Warranty } from "../../../../models/warranty";
import { formatAddress, formatDateFunc } from "../../../../utils/fn";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../../api/services/apiWarranty";
import config from "../../../../configs";
import { Typography } from "antd";
import { OrderProps } from "../../../../models/order";
import moment from "moment";
import { useEffect, useState } from "react";
import { ApiOrder } from "../../../../api/services/apiOrder";

// _mock

// ----------------------------------------------------------------------

type Props = {
  warrantyData: Warranty | undefined;
  open: boolean;
  onClose: VoidFunction;
  orderData?: OrderProps | undefined;
};

interface NoteProps {
  description: string;
}

export default function ModalRequestOrderDetail({
  warrantyData,
  open,
  onClose,
  orderData,
}: Props) {
  const { apiCreateRequestWaranty } = ApiWarranty();

  const createDate = moment();
  const { apiGetOrderId } = ApiOrder();

  const [orderDetail, setOrderDetail] = useState<OrderProps>();

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
    const response = await apiGetOrderId(warrantyData.warrantyDetails.orderId);
    setOrderDetail(response.data);
  };

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

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        Chi tiết đơn bảo hành máy mã{" "}
        {warrantyData?.warrantyDetails?.inventory?.serialNumber}
      </DialogTitle>
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
                <Typography>
                  {orderData
                    ? orderData?.invoiceCode
                    : orderDetail?.invoiceCode}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Tên chủ đơn:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {orderData
                    ? orderData?.userInfo?.fullName
                    : orderDetail?.userInfo?.fullName}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Ngày mua:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {" "}
                  {orderData
                    ? formatDateFunc.formatDate(orderData?.createDate)
                    : formatDateFunc.formatDate(orderDetail?.createDate)}
                  {}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Địa chỉ:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {formatAddress(warrantyData?.warrantyDetails?.address) || ""}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Mã máy:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {warrantyData?.warrantyDetails?.inventory?.serialNumber}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Tên máy:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  {warrantyData?.warrantyDetails?.inventory?.machinery?.name}
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
