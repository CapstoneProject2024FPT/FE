import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import cart from "../Cart/cart.json";
import {
  Button,
  Card,
  CardMedia,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { cartProps } from "../../models/cart";
import EmptyCart from "../../components/EmptyCart";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const calculateTotalPrice = (cartList: cartProps) => {
  let totalPrice = 0;
  cartList.forEach((item) => {
    totalPrice += item.price;
  });
  return totalPrice;
};

const Cart: React.FC = () => {
  const cartList: cartProps = cart as cartProps;

  return (
    <>
      <Typography variant="h3" component="h2">
        Giỏ hàng
      </Typography>
      <Stack />
      {cartList.length > 0 ? (
        <div style={{ backgroundColor: "#ECF0F1" }}>
          <Box sx={{ flexGrow: 1, margin: "5%", padding: "20px" }}>
            <Typography variant="h4" component="div" gutterBottom>
              Cart
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} md={8}>
                {cartList.map((item) => (
                  <Card
                    key={item.id}
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Card style={{ display: "flex", width: "90%" }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 200, height: 150, objectFit: "cover" }}
                        image={item.image}
                        alt={item.name}
                      />
                      <div>
                        <Typography variant="h6" style={{ margin: "10px" }}>
                          {item.name}
                        </Typography>
                        <Typography variant="h6" style={{ margin: "10px" }}>
                          ${item.price}
                        </Typography>
                      </div>
                    </Card>
                    <Stack
                      direction="column"
                      spacing={2}
                      style={{ display: "flow", width: "10%" }}
                    >
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#3498DB",
                          color: "white",
                          fontSize: "20px",
                          cursor: "pointer",
                          width: "60px",
                          margin: "10px",
                        }}
                      >
                        <FavoriteIcon />
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#3498DB",
                          color: "white",
                          fontSize: "20px",
                          cursor: "pointer",
                          width: "60px",
                          margin: "10px",
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Grid>
              <Grid xs={12} md={4}>
                <Item>
                  <TextField
                    label="Voucher Code"
                    variant="outlined"
                    style={{ margin: "10px" }}
                  />
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#3498DB",
                      color: "white",
                      fontSize: "20px",
                      margin: "10px",
                      cursor: "pointer",
                      width: "auto",
                      height: "54px",
                    }}
                  >
                    Apply
                  </Button>
                  <Divider />
                  <Typography
                    component="div"
                    variant="h6"
                    style={{ margin: "10px" }}
                  >
                    Total Price: ${calculateTotalPrice(cartList)}
                  </Typography>
                  <Divider />
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#3498DB",
                      color: "white",
                      fontSize: "20px",
                      cursor: "pointer",
                      width: "auto",
                      margin: "10px",
                    }}
                  >
                    Checkout
                  </Button>
                </Item>
              </Grid>
            </Grid>
          </Box>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ width: "80%" }}>
            <EmptyCart title="Hiện tại chưa có sản phẩm" />
          </Card>
        </Box>
      )}
    </>
  );
};

export default Cart;
