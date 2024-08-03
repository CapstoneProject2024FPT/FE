import { useEffect, useState } from "react";
// @mui
import { Box, Grid, Button, Container } from "@mui/material";

// _mock_

// components

import Iconify from "../../../components/Iconify";
//
import CartSummary from "../CartSection/CartSummary";
import { useCheckout } from "../../../zustand/useCheckout";
import { useAddress } from "../../../zustand/useAddress";
import CheckoutNewAddressForm from "./CheckoutNewAddressForm";
import { ApiAddress } from "../../../api/services/apiAddress";
import { addressProps } from "../../../models/address";
import { toast } from "react-toastify";
// import { formatAddress } from "../../../utils/fn";
import config from "../../../configs";
import AddressButon from "./AddressRadio";
import { FormProvider } from "../../../components/hook-form";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

interface checkoutBillingAndAddress {
  handleBack: () => void;
  handleNextStep: () => void;
  handleGoToStep: (step: number) => void;
}

type FormValuesProps = {
  idAddress: string;
};

const CheckoutBillingAddress: React.FC<checkoutBillingAndAddress> = ({
  handleBack,
  handleNextStep,
  handleGoToStep,
}) => {
  const { total } = useCheckout();
  const { apiGetAddress } = ApiAddress();
  const [addresses, setAddresses] = useState<addressProps[]>([]);
  const { setSelectedAddress } = useAddress();

  //user info
  const loginInfo = localStorage.getItem("loginInfo");

  const loginInfoString = loginInfo ? JSON.parse(loginInfo) : null;

  const user = loginInfoString?.data;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchListAddress = async () => {
    if (user) {
      const params = {
        AccountId: user.id,
      };
      const response = await apiGetAddress(params);
      if (response.status === 200) {
        setAddresses(response.data);
      }
    }
  };

  useEffect(() => {
    fetchListAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateSuccess = () => {
    handleClose();
    toast.success(config.MessageNotice.CreateAddressSuccess);
    fetchListAddress();
  };

  const PaymentSchema = Yup.object().shape({
    idAddress: Yup.string().required("Chọn địa chỉ giao hàng"),
  });

  const defaultValues = {
    idAddress: "",
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
    if (addresses.length > 0) {
      setValue("idAddress", addresses[0].id);
    }
  }, [addresses, setValue]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const selectAddress = addresses.find(
        (item) => (item.id = data.idAddress)
      );
      if (selectAddress) {
        setSelectedAddress(selectAddress);
        handleNextStep();
      }
    } catch (error) {
      toast.error(config.MessageNotice.CreateOrderFailed);
      console.error(error);
    }
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Container sx={{ background: "#ECF0F1", mt: 0 }} maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box maxHeight={500} sx={{ overflow: "auto" }}>
                <AddressButon addressOption={addresses} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  size="small"
                  color="inherit"
                  onClick={handleBack}
                  startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
                >
                  Về Giỏ Hàng
                </Button>
                <Button
                  size="small"
                  onClick={handleClickOpen}
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  variant="contained"
                >
                  Thêm Mới Địa Chỉ
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 3 }}>
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
                Chọn phương thức thanh toán
              </LoadingButton>
            </Grid>
          </Grid>
        </Container>
        {open && (
          <CheckoutNewAddressForm
            onClose={handleClose}
            open={open}
            onSuccess={onCreateSuccess}
          />
        )}
      </FormProvider>
    </>
  );
};

export default CheckoutBillingAddress;
