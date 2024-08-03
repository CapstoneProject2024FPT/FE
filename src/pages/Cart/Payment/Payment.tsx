import React, { useEffect, useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Grid,
  Button,
  Container,
  CardHeader,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// @types
import {
  PaymentOption,
  paymentProps,
  PaymentTypeProps,
} from "../../../models/payment";

// components
import Iconify from "../../../components/Iconify";
import { FormProvider } from "../../../components/hook-form";
//
import CartSummary from "../CartSection/CartSummary";
import CheckoutBillingInfo from "./CheckoutBillingInfo";
import CheckoutPaymentMethods from "./CheckoutPaymentMethods";
import { useCheckout } from "../../../zustand/useCheckout";
import { CartItem } from "../../../models/cart";
import { ApiCheckout } from "../../../api/services/apiCheckout";
import { toast } from "react-toastify";
import { useAddress } from "../../../zustand/useAddress";
import config from "../../../configs";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSendEmail } from "../../../utils/sendEmail";
import { useAuthContext } from "../../../context/AuthContext";

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

type checkoutPaymentProps = {
  handleBack: () => void;
  handleGoToStep: (step: number) => void;
};
const CheckoutPayment: React.FC<checkoutPaymentProps> = ({
  handleBack,
  handleGoToStep,
}) => {
  const { total } = useCheckout();
  const { address } = useAddress();
  const { authUser } = useAuthContext();

  const location = useLocation();
  const navigate = useNavigate();
  //api
  const { apiCheckout, apiPayment, apiPaymentUpdate } = ApiCheckout();

  //cart item
  const cart = localStorage.getItem("cart");

  const cartListString = cart ? JSON.parse(cart) : [];

  const machineList = cartListString.map((cart: CartItem) => ({
    machineryId: cart.id,
    quantity: cart.currentQuantities,
    sellingPrice: cart.sellingPrice,
    stockPrice: cart.sellingPrice,
  }));
  let email: string = "";
  let username: string = "";
  let isSucess: boolean = false;
  //vnreturn
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get("vnp_TransactionStatus");

    const handleTransactionStatus = async () => {
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
            //handle send email
            isSucess = true;
            handleSendEmail(isSucess, email, username);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
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
        }
      }
      sessionStorage.removeItem("paymmentID");
      sessionStorage.removeItem("checkoutTotal");
      localStorage.removeItem("cart");
      sessionStorage.removeItem("address");
    };

    if (transactionId) {
      handleTransactionStatus();
    }
  }, [location, navigate]);

  //payment
  const [note, setNote] = useState<string>("");

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
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (total && address && PAYMENT_OPTIONS.length > 0) {
      setValue("payment", PAYMENT_OPTIONS[0].value);
    } else if (!total) {
      navigate(config.routes.cart.concat("/?step=0"));
      toast.error("Bạn chưa có hàng trong giỏ");
    } else if (!address) {
      setTimeout(() => {
        navigate(config.routes.cart.concat("/?step=1"));
        console.log(config.routes.cart.concat("/?step=1"));

        toast.error("Bạn chưa chọn địa chỉ giao hàng");
      }, 200);
    }
  }, [total, address, setValue]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (address && authUser) {
        const params = {
          description: note,
          machineryList: machineList,
          addressId: address.id,
        };
        const response = await apiCheckout(params);

        if (response.status === 200) {
          //api vnpay
          sessionStorage.setItem("OrderId", response.data);

          if (data.payment === PaymentTypeProps.VNPAY) {
            const paramPayment: paymentProps = {
              orderId: response.data,
              amount: total,
              callbackUrl: window.location.href,
              paymentType: "VNPAY",
              accountId: authUser,
            };

            const responsePayment = await apiPayment(paramPayment);
            sessionStorage.setItem(
              "paymmentID",
              responsePayment.data.paymentId
            );

            if (responsePayment.status === 200) {
              window.location.href = responsePayment.data.url;
            } else {
              navigate(config.routes.paymentFailure);
              toast.error(config.MessageNotice.CreateVnpayFailed);
            }
          } else {
            navigate(config.routes.home);
          }
          //create order failed
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error(config.MessageNotice.CreateOrderFailed);
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="xl" sx={{ background: "#ECF0F1" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ mt: -3 }}>
            <CheckoutPaymentMethods paymentOptions={PAYMENT_OPTIONS} />
            <Card sx={{ mb: 2 }}>
              <CardHeader title="Ghi chú đơn hàng" />
              <CardContent>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={note}
                  placeholder="Nội dung cần ghi chú"
                  onChange={(e) => setNote(e.target.value)}
                />
              </CardContent>
            </Card>
            <Button
              size="small"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
              onClick={handleBack}
            >
              Về Bước Trước
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutBillingInfo onBackStep={handleBack} />

            <CartSummary
              total={total}
              enableEdit
              onEdit={() => handleGoToStep(0)}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Thanh Toán
            </LoadingButton>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
};

export default CheckoutPayment;
