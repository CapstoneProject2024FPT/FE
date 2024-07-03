import React, { useState } from "react";
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
import { PaymentOption } from "../../../models/payment";

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

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: "Vnpay",
    title: "Thanh toán qua cộng Vnpay",
    description: "Bạn sẽ được chuyển đi đến cổng thanh toán Vnpay.",
  },
  {
    value: "COD",
    title: "Thanh toán khi nhận hàng",
    description: "Khi bạn nhận được hàng sẽ thanh toán.",
  },
];

type FormValuesProps = {
  payment: string;
};

type checkoutPaymentProps = {
  handleBack: () => void;
  handleNext: () => void;
  handleGoToStep: (step: number) => void;
};
const CheckoutPayment: React.FC<checkoutPaymentProps> = ({
  handleBack,
  handleNext,
  handleGoToStep,
}) => {
  const { total } = useCheckout();
  //api
  const { apiCheckout } = ApiCheckout();
  //user info
  const loginInfo = localStorage.getItem("loginInfo");

  const loginInfoString = loginInfo ? JSON.parse(loginInfo) : null;

  const user = loginInfoString.data;

  //cart item
  const cart = localStorage.getItem("cart");

  const cartListString = cart ? JSON.parse(cart) : [];

  const machineList = cartListString.map((cart: CartItem) => ({
    machineryId: cart.id,
    quantity: cart.currentQuantities,
    sellingPrice: cart.sellingPrice,
  }));

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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      const params = {
        accountId: user.id,
        totalAmount: total,
        finalAmount: total,
        note: note,
        machineryList: machineList,
      };

      const response = await apiCheckout(params);

      if (response.status === 200) {
        toast.success("Tạo đơn hàng thành công");
        handleNext();
        sessionStorage.removeItem("checkoutTotal");
        sessionStorage.removeItem("cart");
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
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
