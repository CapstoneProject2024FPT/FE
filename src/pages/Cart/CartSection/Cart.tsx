/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { cartProps } from "../../../models/cart";
import EmptyCart from "../../../components/EmptyCart";
import { formatMoney } from "../../../utils/fn";
import Image from "../../../components/Image";
import Iconify from "../../../components/Iconify";
import CartSummary from "./CartSummary";
import { Link } from "react-router-dom";
import config from "../../../configs";
import { useCheckout } from "../../../zustand/useCheckout";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { CustomerApi } from "../../../api/services/apiUser";
import { useAuthContext } from "../../../context/AuthContext";
import { userModel } from "../../../models/UserData";

const IncrementerStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px rgba(145, 158, 171, 0.32)`,
}));

interface CartProp {
  handleNext: () => void;
}

// Retrieve and parse cart items from localStorage, ensuring valid JSON
const getCartItems = (): cartProps => {
  const cartList = localStorage.getItem("cart");
  try {
    return cartList ? JSON.parse(cartList) : [];
  } catch (error) {
    console.error("Error parsing cart data from localStorage", error);
    return [];
  }
};

const Cart: React.FC<CartProp> = ({ handleNext }) => {
  const [CartItems, setCartItems] = useState<cartProps>(getCartItems());
  const { apiGetDetailMachine } = MachineryApi();
  const { authUser } = useAuthContext();
  const { apiUserProfile } = CustomerApi();
  const [userProfile, setUserProfile] = useState<userModel>();

  const { setTotal, total, setDiscountRank, discountRank } = useCheckout();

  useEffect(() => {
    const fetchCorrectQuantities = async () => {
      try {
        const updatedCart = await Promise.all(
          CartItems.map(async (item) => {
            const response = await apiGetDetailMachine(item.id);
            return {
              ...item,
              quantity: response.data.quantity,
            };
          })
        );
        setCartItems(updatedCart);
      } catch (error) {
        console.error("Error get product quantities", error);
      }
    };

    fetchCorrectQuantities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(CartItems));
    const totalPrice = calculateTotalPrice(CartItems);
    setTotal(totalPrice);
  }, [CartItems, setTotal]);

  useEffect(() => {
    if (userProfile) {
      const totalPrice = calculateTotalPrice(CartItems);
      const discountPrice = calculateDiscount(totalPrice);
      setDiscountRank(discountPrice);
    } else {
      setDiscountRank(0); // Clear the discount if the userProfile is not available
    }
  }, [userProfile, total, CartItems, setDiscountRank]);

  const calculateTotalPrice = (CartItems: cartProps) => {
    let totalPrice = 0;
    CartItems.forEach((item) => {
      totalPrice += item.finalAmount * item.currentQuantities;
    });

    return totalPrice;
  };

  const calculateDiscount = (total: number) => {
    if (!userProfile || !userProfile.rank || !userProfile.rank.value) return 0;

    let discount = 0;
    discount = total * (userProfile.rank.value / 100);

    // return Math.floor(discount);
    return discount;
  };

  const increaseQuantity = (id: string) => {
    const updateCart = CartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          currentQuantities: item.currentQuantities + 1,
        };
      }
      return item;
    });

    setCartItems(updateCart);
  };

  const decreaseQuantity = (id: string) => {
    const updateCart = CartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          currentQuantities: item.currentQuantities - 1,
        };
      }
      return item;
    });

    setCartItems(updateCart);
  };

  const deleteProduct = (id: string) => {
    const updateCart = CartItems.filter((item) => item.id != id);
    setCartItems(updateCart);
  };

  const fetchUser = async () => {
    if (!authUser) return;
    const response = await apiUserProfile(authUser);
    if (response.status === 200) {
      setUserProfile(response.data);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchUser();
    } else {
      setUserProfile(undefined); // Clear userProfile on logout
    }
  }, [authUser]);

  return (
    <>
      {CartItems.length > 0 ? (
        <div style={{ backgroundColor: "#ECF0F1" }}>
          <Box sx={{ flexGrow: 1, padding: "20px" }}>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Giỏ hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TableContainer sx={{ maxWidth: 820 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "white" }}>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Giá bán</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Tổng giá</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {CartItems?.map((item, index) => (
                        <TableRow
                          sx={{ height: "130px", background: "white" }}
                          key={index}
                        >
                          <TableCell
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              alt={item.name}
                              src={item.image[0].imageURL}
                              sx={{
                                width: 100,
                                height: 100,
                                borderRadius: 1.5,
                                mr: 2,
                              }}
                            />

                            <Stack spacing={0.5}>
                              <Link
                                to={config.routes.productDetail.replace(
                                  ":id",
                                  item.id
                                )}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <Typography
                                  noWrap
                                  variant="subtitle2"
                                  sx={{
                                    color: "black",
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              </Link>
                              <Stack direction="row" alignItems="center">
                                <Typography variant="body2">
                                  <Box
                                    component="span"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {item.model}
                                  </Box>
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Stack direction="column" spacing={0.5}>
                              <Typography variant="subtitle1">
                                {item
                                  ? formatMoney(
                                      (item.sellingPrice *
                                        (100 - item.discount)) /
                                        100
                                    )
                                  : 0}
                              </Typography>
                              {item?.discount > 0 && (
                                <Typography
                                  component="span"
                                  sx={{
                                    color: "text.disabled",
                                    textDecoration: "line-through",
                                  }}
                                >
                                  {formatMoney(item.sellingPrice)}
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Box sx={{ width: 96, textAlign: "right" }}>
                              <IncrementerStyle>
                                <IconButton
                                  size="small"
                                  color="inherit"
                                  onClick={() => decreaseQuantity(item.id)}
                                  disabled={item.currentQuantities <= 1}
                                >
                                  <Iconify
                                    icon={"eva:minus-fill"}
                                    width={16}
                                    height={16}
                                  />
                                </IconButton>

                                {item.currentQuantities}

                                <IconButton
                                  size="small"
                                  color="inherit"
                                  onClick={() => increaseQuantity(item.id)}
                                  disabled={
                                    item.currentQuantities >=
                                    (item.quantity?.Available ?? 0)
                                  }
                                >
                                  <Iconify
                                    icon={"eva:plus-fill"}
                                    width={16}
                                    height={16}
                                  />
                                </IconButton>
                              </IncrementerStyle>

                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                              >
                                số lượng:{" "}
                                {item?.quantity?.Available
                                  ? item?.quantity?.Available
                                  : 0}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="right">
                            {formatMoney(
                              item?.finalAmount * item.currentQuantities
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton onClick={() => deleteProduct(item.id)}>
                              <Iconify
                                icon={"eva:trash-2-outline"}
                                width={20}
                                height={20}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Link to={config.routes.productList} style={{ color: "black" }}>
                  <Button
                    sx={{ mt: 2, border: "1px solid #d9d9d9" }}
                    color="inherit"
                    startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
                  >
                    Tiếp Tục Mua Sắm
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} md={4} sx={{ mt: 2 }}>
                <CartSummary total={total} discount={discountRank} />
                <Button
                  variant="contained"
                  fullWidth
                  disabled={CartItems.length === 0}
                  onClick={handleNext}
                >
                  Chọn địa chỉ
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      ) : (
        <Container
          sx={{
            maxWidth: "100%",
            background: "rgb(239,239,240)",
          }}
          maxWidth={false}
        >
          <Typography variant="h4" component="div" gutterBottom sx={{ mb: 3 }}>
            Giỏ hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ width: "100%" }}>
                <EmptyCart title="Hiện tại chưa có sản phẩm" />
              </Card>
              <Link to={config.routes.productList}>
                <Button
                  color="inherit"
                  startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
                  sx={{ border: "1px solid #d9d9d9", margin: "15px 0" }}
                >
                  Tiếp Tục Mua Sắm
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <CartSummary total={total} discount={discountRank} />
              <Button
                variant="contained"
                fullWidth
                disabled={CartItems.length === 0}
                onClick={handleNext}
              >
                Chọn địa chỉ
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default Cart;
