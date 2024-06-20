import { useState } from "react";
// @mui
import { Box, Grid, Card, Button, Typography, Container } from "@mui/material";

// _mock_

// components

import Iconify from "../../../components/Iconify";
//
import CartSummary from "../CartSection/CartSummary";
import { useCheckout } from "../../../zustand/useCheckout";
import { addressUser, addresses } from "./address";
import { useAddress } from "../../../zustand/useAddress";

// ----------------------------------------------------------------------

interface checkoutBillingAndAddress {
  handleBack: () => void;
  handleNextStep: () => void;
}
const CheckoutBillingAddress: React.FC<checkoutBillingAndAddress> = ({
  handleBack,
  handleNextStep,
}) => {
  const { total } = useCheckout();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(open, handleClose);

  return (
    <>
      <Container sx={{ background: "#ECF0F1" }} maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {addresses.map((address, index) => (
              <AddressItem
                key={index}
                onNextStep={handleNextStep}
                address={address}
              />
            ))}
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

          <Grid item xs={12} md={4}>
            <CartSummary total={total} />
            <Button variant="contained" fullWidth onClick={handleNextStep}>
              Tiếp Tục
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CheckoutBillingAddress;
// ----------------------------------------------------------------------

type AddressItemProps = {
  address: addressUser;
  onNextStep: VoidFunction;
};

function AddressItem({ onNextStep, address }: AddressItemProps) {
  const { selectedAddress } = useAddress();
  const { addressType, fullAddress, isDefault, phone, receiver } = address;

  const handleCreateBilling = () => {
    selectedAddress(address);
    onNextStep();
  };
  return (
    <Card sx={{ p: 3, mb: 3, position: "relative" }}>
      <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle1">{receiver}</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          &nbsp;({addressType})
        </Typography>

        {isDefault && (
          <Typography color="info" sx={{ ml: 1 }}>
            Mặc Định
          </Typography>
        )}
      </Box>

      <Typography variant="body2" gutterBottom>
        {fullAddress}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {phone}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          position: { sm: "absolute" },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
        {!isDefault && (
          <Button variant="outlined" size="small" color="inherit">
            Xoá
          </Button>
        )}
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling}>
          Giao hàng tại Địa Chỉ này
        </Button>
      </Box>
    </Card>
  );
}
