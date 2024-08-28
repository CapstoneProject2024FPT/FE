import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Grid,
  CardHeader,
  Card,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Box,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// @types
import {
  PaymentOption,
  paymentProps,
  PaymentTypeProps,
} from "../../../models/payment";

// components
import { FormProvider } from "../../../components/hook-form";
//
import { ApiCheckout } from "../../../api/services/apiCheckout";
import config from "../../../configs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrderProps, statusMapping, StatusType } from "../../../models/order";
import CheckoutPaymentMethods from "../../Cart/Payment/CheckoutPaymentMethods";
import { ApiOrder } from "../../../api/services/apiOrder";
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";
import { useAuthContext } from "../../../context/AuthContext";
import { handleSendEmail } from "../../../utils/sendEmail";

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: "VNPAY",
    title: "Thanh toán qua cộng Vnpay",
    description: "Bạn sẽ được chuyển đi đến cổng thanh toán Vnpay.",
  },
];

type FormValuesProps = {
  payment: string;
};

const PaymentOrderId: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<OrderProps>();

  //api
  const { apiGetOrderId } = ApiOrder();
  const { apiPayment, apiPaymentUpdate } = ApiCheckout();

  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);

  let email: string;
  let username: string;

  //status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "UnPaid":
        return { backgroundColor: "#FFD700", color: "black" }; // vàng
      case "Paid":
        return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
      case "Completed":
        return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
      case "Canceled":
        return { backgroundColor: "#F44336", color: "white" }; // đỏ
      case "Delivery":
        return { backgroundColor: "#f39c12", color: "black" }; // vàng
      case "ReDelivery":
        return { backgroundColor: "#704c5e", color: "white" }; // Tím
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };

  const handleStatusName = (text: string) => {
    if (!text) return;

    const defaultStatus = "Đang chờ xác nhận";
    const StatusName = text
      ? statusMapping?.find((status) => status.id === text)?.name
      : defaultStatus;

    return StatusName;
  };
  //vnreturn
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get("vnp_TransactionStatus");

    const handleTransactionStatus = async (invoiceCode: string) => {
      setLoading(true);
      const id = sessionStorage.getItem("paymmentID");
      if (transactionId === "00" && id) {
        const params = { status: "SUCCESS" };
        try {
          const response = await apiPaymentUpdate(params, id);

          // handle
          const getUserInfoString = localStorage.getItem("getUserInfo");
          if (getUserInfoString) {
            const userInfo = JSON.parse(getUserInfoString);
            email = userInfo?.email;
            username = userInfo?.username;
          } else {
            console.error("No user info found in localStorage");
          }

          if (response.status === 200) {
            navigate(config.routes.paymentSuccessful);
            const isSucess = true;
            handleSendEmail(isSucess, email, username, invoiceCode);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        } finally {
          setLoading(false);
        }
      } else if (id) {
        const params = { status: "FAILED" };
        try {
          const response = await apiPaymentUpdate(params, id);
          if (response.status === 200) {
            navigate(config.routes.paymentFailure);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        } finally {
          setLoading(false);
        }
      }
      sessionStorage.removeItem("paymmentID");
      sessionStorage.removeItem("checkoutTotal");
      localStorage.removeItem("cart");
      sessionStorage.removeItem("address");
    };

    if (transactionId && orderData?.invoiceCode) {
      handleTransactionStatus(orderData?.invoiceCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate, orderData]);

  //payment

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required("Chọn Phương Thức Thanh Toán"),
  });

  const defaultValues = {
    payment: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      //api vnpay
      if (orderData && authUser) {
        const typeOrder =
          orderData.type === "Order" ? "VNPAY_Order" : "VNPAY_Warranty";
        if (data.payment === PaymentTypeProps.VNPAY) {
          const paramPayment: paymentProps = {
            orderId: orderData.orderId,
            amount: orderData.finalAmount,
            callbackUrl: window.location.href,
            paymentType: typeOrder,
            accountId: authUser,
          };

          const responsePayment = await apiPayment(paramPayment);
          sessionStorage.setItem("paymmentID", responsePayment.data.paymentId);

          if (responsePayment.status === 200) {
            window.location.href = responsePayment.data.url;
          } else {
            console.error("Khởi tạo vnpay lỗi", responsePayment);
          }
        }
      }
    } catch (error) {
      //   toast.error("Xảy ra lỗi trong quá trình tạo đơn hàng");
      console.error(error);
    }
  };

  //api
  const fetchOrderId = useCallback(async () => {
    if (id) {
      sessionStorage.setItem("OrderId", id);
      const response = await apiGetOrderId(id);
      setOrderData(response.data);
    }
  }, [apiGetOrderId, id]);

  useEffect(() => {
    fetchOrderId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {orderData?.status === StatusType.UNPAID && (
          <Grid item xs={12} md={4} sx={{ mt: -3 }}>
            <CheckoutPaymentMethods paymentOptions={PAYMENT_OPTIONS} />
          </Grid>
        )}

        <Grid
          item
          xs={12}
          md={orderData?.status === StatusType.UNPAID ? 8 : 12}
        >
          <Card sx={{ p: 2 }}>
            <CardHeader title="Thông tin đơn hàng" />
            <Stack display="flex" direction="column" spacing={2}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Typography>Mã đơn hàng:</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography>{orderData?.invoiceCode}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Tên chủ đơn:</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography>{orderData?.userInfo?.fullName}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Ngày tạo đơn:</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography>
                    {formatDateFunc.formatDateTime(orderData?.createDate)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Tổng thành tiền:</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography>{formatMoney(orderData?.finalAmount)}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Địa chỉ:</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography>{formatAddress(orderData?.address)}</Typography>
                </Grid>
              </Grid>
              <Box>
                <Box
                  sx={{
                    ...getStatusStyles(orderData?.status ?? ""),
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  <Typography>
                    Trạng thái: {handleStatusName(orderData?.status ?? "")}
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Divider sx={{ mt: 2 }} />
            <Typography variant="h5" sx={{ mt: 4 }}>
              Chi tiết sản phẩm
            </Typography>
            <Table size="small" aria-label="products">
              <TableHead>
                <TableRow>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá sản phẩm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData?.type === "Order" ? (
                  <>
                    {orderData?.productList.map((product) => (
                      <TableRow key={product.orderDetailId}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          {formatMoney(product.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {orderData?.productList.map((product) => (
                      <TableRow key={product.orderDetailId}>
                        <TableCell>{product.machineComponentName}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          {formatMoney(product.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </Card>
          {orderData?.status === StatusType.UNPAID && (
            <LoadingButton
              fullWidth
              sx={{ mt: 2 }}
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Thanh Toán
            </LoadingButton>
          )}
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang thực hiện thanh toán...
        </Typography>
      </Backdrop>
    </FormProvider>
  );
};

export default PaymentOrderId;
