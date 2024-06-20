import React from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Grid, Button, Container } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// @types
import { CardOption, PaymentOption } from "../../../models/payment";

// components
import Iconify from "../../../components/Iconify";
import { FormProvider } from "../../../components/hook-form";
//
import CartSummary from "../CartSection/CartSummary";
import CheckoutBillingInfo from "./CheckoutBillingInfo";
import CheckoutPaymentMethods from "./CheckoutPaymentMethods";
import { useCheckout } from "../../../zustand/useCheckout";

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: "paypal",
    title: "Pay with Paypal",
    description:
      "You will be redirected to PayPal website to complete your purchase securely.",
    icons: [
      "https://minimal-assets-api-dev.vercel.app/assets/icons/ic_paypal.svg",
    ],
  },
  {
    value: "credit_card",
    title: "Credit / Debit Card",
    description: "We support Mastercard, Visa, Discover and Stripe.",
    icons: [
      "https://minimal-assets-api-dev.vercel.app/assets/icons/ic_mastercard.svg",
      "https://minimal-assets-api-dev.vercel.app/assets/icons/ic_visa.svg",
    ],
  },
  {
    value: "cash",
    title: "Cash on CheckoutDelivery",
    description: "Pay with cash when your order is delivered.",
    icons: [],
  },
];

const CARDS_OPTIONS: CardOption[] = [
  { value: "ViSa1", label: "**** **** **** 1212 - Jimmy Holland" },
  { value: "ViSa2", label: "**** **** **** 2424 - Shawn Stokes" },
  { value: "MasterCard", label: "**** **** **** 4545 - Cole Armstrong" },
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
      handleNext();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="xl" sx={{ background: "#ECF0F1" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ mt: -3 }}>
            <CheckoutPaymentMethods
              cardOptions={CARDS_OPTIONS}
              paymentOptions={PAYMENT_OPTIONS}
            />
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
