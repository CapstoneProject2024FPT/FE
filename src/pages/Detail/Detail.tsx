/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  InputBase,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ShoppingCart,
  Unarchive,
  FmdGood,
  LocalAtm,
  Refresh,
  Verified,
  LocalPolice,
  FavoriteSharp,
} from "@mui/icons-material";
import Zoom from "../../components/zoomImageHover";
import "./detail.scss";
const mockProduct = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description:
    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
  category: "beauty",
  price: 9.99,
  discountPercentage: 7.17,
  rating: 3.214352,
  stock: 5,
  tags: ["beauty", "mascara"],
  brand: "Essence",
  sku: "RCH45Q1A",
  weight: 2,
  dimensions: {
    width: 23.17,
    height: 14.43,
    depth: 28.01,
  },
  warrantyInformation: "1 month warranty",
  shippingInformation: "Ships in 1 month",
  availabilityStatus: "Low Stock",
  reviews: [
    {
      rating: 2,
      comment: "Very unhappy with my purchase!",
      date: "2024-05-23T08:56:21.618Z",
      reviewerName: "John Doe",
      reviewerEmail: "john.doe@x.dummyjson.com",
    },
    {
      rating: 2,
      comment: "Not as described!",
      date: "2024-05-23T08:56:21.618Z",
      reviewerName: "Nolan Gonzalez",
      reviewerEmail: "nolan.gonzalez@x.dummyjson.com",
    },
    {
      rating: 5,
      comment: "Very satisfied!",
      date: "2024-05-23T08:56:21.618Z",
      reviewerName: "Scarlett Wright",
      reviewerEmail: "scarlett.wright@x.dummyjson.com",
    },
  ],
  returnPolicy: "30 days return policy",
  minimumOrderQuantity: 24,
  meta: {
    createdAt: "2024-05-23T08:56:21.618Z",
    updatedAt: "2024-05-23T08:56:21.618Z",
    barcode: "9164035109868",
    qrCode: "...",
  },
  thumbnail: "...",
  images: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1507457379470-08b800bebc67?q=80&w=1818&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
};

const Detail: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [currentQuantities, setCurrentQuantities] = useState<number>(1);
  const [isActive, setActive] = useState(false);
  const [isRed, setIsRed] = useState(false);

  const handleClickButton = () => {
    setIsRed(!isRed);
  };

  const buttonStyle = {
    fontSize: "24px",
    cursor: "pointer",
    transition: "color 0.3s",
    border: "none",
    background: "none",
    outline: "none",
    color: isRed ? "red" : "gray",
  };
  const onChangeQuantities = (e: any) => {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex

    if (e.target.value === "" || re.test(e.target.value)) {
      setCurrentQuantities(Number(e.target.value));
    }
  };

  const increaseQuantity = () => {
    setCurrentQuantities(currentQuantities + 1);
  };

  const decreaseQuantity = () => {
    if (currentQuantities === 1) return;
    setCurrentQuantities(currentQuantities - 1);
  };

  const toggleClass = () => {
    if (isActive) return;
    setActive(!isActive);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "30%", height: "100%" }}>
        <Box sx={{ position: "relative" }}>
          <ArrowBackIos
            sx={{
              position: "absolute",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "36px",
              padding: "10px",
              paddingLeft: "13px",
              cursor: "pointer",
              top: "43%",
              left: "5px",

              "&:hover": { backgroundColor: "lightgrey" },
            }}
            onClick={() =>
              setSelectedImage(
                selectedImage === 0
                  ? mockProduct.images.length - 1
                  : selectedImage - 1
              )
            }
          />
          <Zoom
            src={mockProduct.images[selectedImage]}
            width="100%"
            height="300px"
          />
          <ArrowForwardIos
            sx={{
              position: "absolute",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "36px",
              padding: "10px",
              paddingLeft: "13px",
              cursor: "pointer",
              top: "43%",
              right: "5px",

              "&:hover": { backgroundColor: "lightgrey" },
            }}
            onClick={() =>
              setSelectedImage(
                selectedImage === mockProduct.images.length - 1
                  ? 0
                  : selectedImage + 1
              )
            }
          />
        </Box>

        <ImageList sx={{ width: "100%" }} cols={3} rowHeight={164}>
          {mockProduct.images.map((img, index) => (
            <ImageListItem key={img} sx={{ cursor: "pointer" }}>
              <img
                src={img}
                alt={img}
                loading="lazy"
                onClick={() => setSelectedImage(index)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      <Box sx={{ width: "68%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4">{mockProduct.title}</Typography>
          </Box>
          <IconButton onClick={handleClickButton}>
            <FavoriteSharp style={buttonStyle}/>
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", margin: "10px 0" }}>
          <Typography sx={{ paddingRight: "30px" }}>
            Thương hiệu:{" "}
            <Typography
              component={"span"}
              sx={{ cursor: "pointer", color: "blue" }}
            >
              {mockProduct.brand}
            </Typography>
          </Typography>

          <Typography sx={{ color: "lightgrey" }}>
            SKU: {mockProduct.sku}
          </Typography>
        </Box>

        <Divider sx={{ borderBottomWidth: "5px", margin: "20px 0" }} />

        <Box sx={{ display: "flex", height: "100%" }}>
          <Box
            sx={{
              width: "60%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {/* Discounted price */}
            <Typography
              sx={{
                color: "orange",
                "&:after": { content: "' VNĐ'" },
              }}
              variant="h4"
            >
              {(mockProduct.price * (100 - mockProduct.discountPercentage)) /
                100}
            </Typography>
            {/* Original Price */}
            <Typography
              sx={{
                color: "gray",
                textDecoration: "line-through",
                "&:after": { content: "' VNĐ'" },
              }}
              variant="h5"
            >
              {mockProduct.price}
            </Typography>
            <Typography
              sx={{
                color: "red",
                "&:after": { content: "'%'" },
                "&:before": { content: "'-'" },
              }}
              variant="h5"
            >
              {mockProduct.discountPercentage}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              Số lượng:
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                }}
              >
                <Button
                  sx={{
                    width: "34px",
                    height: "34px",
                    minWidth: "34px",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,

                    "&:hover": { backgroundColor: "lightgrey" },
                    "&.disabled:hover": {
                      cursor: "not-allowed",
                    },
                  }}
                  onClick={() => decreaseQuantity()}
                  className={`${currentQuantities <= 1 && "disabled"}`}
                >
                  -
                </Button>
                <Divider orientation="vertical" flexItem />
                <InputBase
                  value={currentQuantities}
                  sx={{
                    width: "40px",
                    height: "34px",
                    textAlignLast: "center",
                  }}
                  type="text"
                  onChange={onChangeQuantities}
                ></InputBase>
                <Divider orientation="vertical" flexItem />
                <Button
                  sx={{
                    width: "34px",
                    height: "34px",
                    minWidth: "34px",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,

                    "&:hover": { backgroundColor: "lightgrey" },
                  }}
                  onClick={() => increaseQuantity()}
                >
                  +
                </Button>
              </Box>
            </Box>

            <Button
              className={`cart-button ${isActive && "clicked"}`}
              onClick={toggleClass}
              sx={{
                marginTop: "20px",
                position: "relative",
                width: "200px",
                height: "60px",
                border: "0",
                borderRadius: "10px",
                backgroundColor: "#4834d4",
                outline: "none",
                cursor: "pointer",
                color: "#fff",
                transition: "0.3s ease-in-out",
                overflow: "hidden",

                "&:hover": {
                  backgroundColor: "#35269b",
                },

                "&:active": {
                  transform: "scale(0.9)",
                },
              }}
            >
              <span className="add-to-cart">Add to cart</span>
              <span className="added">Added</span>
              <ShoppingCart className="fas fa-shopping-cart" />
              <Unarchive className="fas fa-box" />
            </Button>
          </Box>
          <Divider orientation="vertical" flexItem  sx={{margin: "0 8px"}}/>
          <Box
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                Địa chỉ giao hàng
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <FmdGood
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                    marginRight: "8px",
                  }}
                />
                <Typography>Chưa chọn địa chỉ giao hàng</Typography>
                <Button
                  sx={{
                    color: "grey",
                    transform: "translateX(100%)",
                    textTransform: "inherit",
                    "&:hover": {
                      color: "blue",
                    },
                  }}
                >
                  {" "}
                  Đổi{" "}
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <LocalAtm
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                    marginRight: "8px",
                  }}
                />
                <Typography>Thanh toán tiền mặt/Online</Typography>
              </Box>
            </Box>
            <Divider sx={{ borderBottomWidth: "1px", margin: "0 20px" }} />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                Đổi trả & bảo hành
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Refresh
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                    alignSelf: "flex-start",
                    transform: "scaleX(-1)",
                    marginRight: "8px",
                  }}
                />
                <Box>
                  <Typography>7 ngày hoàn tiền miễn phí</Typography>
                  <Typography
                    sx={{ fontSize: "13px", color: "grey", lineHeight: "13px" }}
                  >
                    Hoàn tiền sau 7-14 ngày
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Verified
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                    alignSelf: "flex-start",
                    marginRight: "8px",
                  }}
                />
                <Typography>100% hàng chính hãng</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <LocalPolice
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                    alignSelf: "flex-start",
                    marginRight: "8px",
                  }}
                />
                <Typography>Bảo hành định kỳ</Typography>
              </Box>
            </Box>
            <Divider sx={{ borderBottomWidth: "1px", margin: "0 20px" }} />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Được bán bởi</Typography>
              <Typography
                sx={{ fontWeight: 600, color: "orange", marginTop: "8px" }}
              >
                SMMMS Corporation
              </Typography>
            </Box>
            <Divider sx={{ borderBottomWidth: "1px", margin: "0 20px" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Detail;
