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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowBackIos,
  ArrowForwardIos,
  FavoriteBorder,
  ShoppingCart,
  Unarchive,
  FmdGood,
  LocalAtm,
  Refresh,
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

// const useStyles = makeStyles({
//   addToCart: {
//     "-color": "#fff",
//     "-icon": "var(--color)",
//     "-cart": "#fff",
//     "-dots": "#fff",
//     "-background": "#0099ff",
//     "-shadow": "rgba(0, 9, 61, 0.16)",
//     cursor: "pointer",
//     position: "relative",
//     outline: "none",
//     border: "none",
//     WebkitAppearance: "none",
//     WebkitTapHighlightColor: "transparent",
//     fontSize: "16px",
//     borderRadius: "22px",
//     padding: "12px 32px",
//     fontWeight: "500",
//     lineHeight: "20px",
//     WebkitTransform: "scale(var(--s, 0.97))",
//     transform: "scale(var(--s, 0.97))",
//     boxShadow: "0 var(--s-y, 4px) var(--s-b, 12px) var(--shadow)",
//     color: "var(--color)",
//     background: "var(--background)",
//     transition: "transform .3s, box-shadow .3s, -webkit-transform .3s",

//     ".default": {
//       paddingLeft: "16px",
//       position: "relative",
//       opacity: "var(--o, 1)",
//       WebkitTransform: "scale(var(--s, 1))",
//       transform: "scale(var(--s, 1))",
//       transition: "transform .3s, opacity .3s, -webkit-transform .3s",
//       transitionDelay: "var(--d, 0.3s)",
//     },
//     ".default:before, .add-to-cart .default:after": {
//       content: "''",
//       width: "2px",
//       height: "12px",
//       left: "0",
//       top: "4px",
//       borderRadius: "1px",
//       background: "var(--icon)",
//       position: "absolute",
//       WebkitTransform: "rotate(var(--r, 0deg))",
//       transform: "rotate(var(--r, 0deg))",
//       transition: "transform .25s, -webkit-transform .25s",
//     },
//     ".default:after": {
//       "-r": "90deg",
//     },
//     ".success": {
//       opacity: "var(--o, 0)",
//       WebkitTransform: "translate(-50%, var(--y, 12px))",
//       transform: "translate(-50%, var(--y, 12px))",
//       position: "absolute",
//       top: "12px",
//       left: "50%",
//       transition: "opacity .3s, transform .3s, -webkit-transform .3s",
//       transitionDelay: "var(--d, 0s)",
//     },
//     ".dots": {
//       width: "4px",
//       height: "4px",
//       top: "20px",
//       left: "50%",
//       marginLeft: "-7px",
//       borderRadius: "2px",
//       position: "absolute",
//       WebkitTransformOrigin: "10px 50%",
//       transformOrigin: "10px 50%",
//       background: "var(--dots)",
//       boxShadow: "5px 0 0 var(--dots), 10px 0 0 var(--dots)",
//       opacity: "var(--o, 0)",
//       WebkitTransform: "scale(var(--s, 0.4))",
//       transform: "scale(var(--s, 0.4))",
//       transition: "opacity .3s, transform .3s, -webkit-transform .3s",
//       transitionDelay: "var(--d, 0s)",
//     },
//     ".cart": {
//       position: "absolute",
//       left: "0",
//       top: "0",
//       right: "0",
//       bottom: "0",
//       zIndex: "1",
//       borderRadius: "inherit",
//       overflow: "hidden",
//       WebkitMaskImage: "-webkit-radial-gradient(white, black)",
//     },
//     ".cart:before": {
//       content: "''",
//       position: "absolute",
//       width: "20px",
//       height: "16px",
//       background: "var(--background)",
//       top: "17px",
//       right: "100%",
//       zIndex: "1",
//       marginRight: "-20px",
//       WebkitTransform: "translateX(-18px) rotate(-16deg)",
//       transform: "translateX(-18px) rotate(-16deg)",
//     },
//     ".cart > div": {
//       top: "13px",
//       right: "100%",
//       WebkitTransform: "translateX(-18px) rotate(-16deg)",
//       transform: "translateX(-18px) rotate(-16deg)",
//       position: "absolute",
//       zIndex: "2",
//       WebkitTransformOrigin: "1px 21px",
//       transformOrigin: "1px 21px",
//     },
//     ".cart > div:before, .cart > div:after": {
//       content: "''",
//       position: "absolute",
//       top: "var(--t, 4px)",
//       left: "var(--l, 0)",
//       height: "2px",
//       width: "var(--w, 18px)",
//       background: "var(--cart)",
//       borderRadius: "1px",
//     },
//     ".cart > div:after": {
//       "-w": "16px",
//       "-t": "14px",
//       "-l": "1px",
//     },
//     ".cart > div > div": {
//       width: "2px",
//       height: "var(--h, 15px)",
//       borderRadius: "1px",
//       WebkitTransform: "rotate(var(--r, -8deg))",
//       transform: "rotate(var(--r, -8deg))",
//       background: "var(--cart)",
//       position: "relative",
//     },
//     ".cart > div > div:before, .cart > div > div:after": {
//       content: "''",
//       position: "absolute",
//       background: "inherit",
//     },
//     ".cart > div > div:after": {
//       width: "4px",
//       height: "4px",
//       borderRadius: "2px",
//       bottom: "var(--b, -6px)",
//       left: "var(--l, 0)",
//     },
//     ".cart > div > div:first-child:before": {
//       borderRadius: "inherit",
//       top: "0",
//       right: "0",
//       height: "2px",
//       width: "6px",
//       WebkitTransformOrigin: "5px 1px",
//       transformOrigin: "5px 1px",
//       WebkitTransform: "rotate(16deg)",
//       transform: "rotate(16deg)",
//     },
//     ".cart > div > div:last-child": {
//       "-h": "12px",
//       "-r": "8deg",
//       position: "absolute",
//       left: "16px",
//       bottom: "-1px",
//     },
//     ".cart > div > div:last-child:after": {
//       "-l": "-2px",
//       "-b": "-5px",
//     },
//     "&.added .default": {
//       "-o": "0",
//       "-s": ".8",
//       "-d": "0s",
//     },
//     "&.added .default:before": {
//       "-r": "-180deg",
//     },
//     "&.added .default:after": {
//       "-r": "-90deg",
//     },
//     "&.added .dots": {
//       "-o": "1",
//       "-s": "1",
//       "-d": ".3s",
//       animation: "$dot 2s linear forwards",
//       WebkitAnimation: "$dot 2s linear forwards",
//     },
//     "&.added .success": {
//       "-o": "1",
//       "-y": "0",
//       "-d": "1.8s",
//     },
//     "&.added .cart:before, &.added .cart > div": {
//       WebkitAnimation: "$cart 2s forwards",
//       animation: "$cart 2s forwards",
//     },
//     "&:not(.added):hover": {
//       "-s": "1",
//       "-sY": "8px",
//       "-sB": "20px",
//     },
//     "&:not(.added):active": {
//       "-s": ".94",
//       "-sY": "2px",
//       "-sB": "6px",
//     },
//   },

//   "@keyframes cart": {
//     "40": {
//       WebkitTransform: "translateX(72px) rotate(0deg) translateY(1px)",
//       transform: "translateX(72px) rotate(0deg) translateY(1px)",
//     },
//     "41": {
//       WebkitTransform: "translateX(72px) rotate(0deg)",
//       transform: "translateX(72px) rotate(0deg)",
//     },
//     "47": {
//       WebkitTransform: "translateX(72px) rotate(0deg) translateY(1px)",
//       transform: "translateX(72px) rotate(0deg) translateY(1px)",
//     },
//     "49": {
//       WebkitTransform: "translateX(72px) rotate(0deg)",
//       transform: "translateX(72px) rotate(0deg)",
//     },
//     "54": {
//       WebkitTransform: "translateX(72px) rotate(0deg) translateY(1px)",
//       transform: "translateX(72px) rotate(0deg) translateY(1px)",
//     },
//     "57": {
//       WebkitTransform: "translateX(72px) rotate(0deg)",
//       transform: "translateX(72px) rotate(0deg)",
//     },
//     "60": {
//       WebkitTransform: "translateX(72px) rotate(0deg)",
//       transform: "translateX(72px) rotate(0deg)",
//     },
//     "100": {
//       WebkitTransform: "translateX(180px) rotate(-16deg)",
//       transform: "translateX(180px) rotate(-16deg)",
//     },
//   },
//   "@keyframes dot": {
//     "5": {
//       WebkitTransform: "translateY(0)",
//       transform: "translateY(0)",
//     },
//     "25": {
//       WebkitTransform: "translateY(-20px) rotate(-32deg)",
//       transform: "translateY(-20px) rotate(-32deg)",
//       boxShadow: "5px 0 0 var(--dots), 10px 0 0 var(--dots)",
//     },
//     "31": {
//       boxShadow: "5px -4px 0 var(--dots), 10px -8px 0 var(--dots)",
//     },
//     "32": {
//       WebkitTransform: "translateY(0) rotate(0deg)",
//       transform: "translateY(0) rotate(0deg)",
//       opacity: "1",
//     },
//     "45": {
//       boxShadow: "5px 0 0 var(--dots), 10px 0 0 var(--dots)",
//     },
//     "50": {
//       WebkitTransform: "translateY(0) rotate(0deg)",
//       transform: "translateY(0) rotate(0deg)",
//       opacity: "1",
//     },
//     "51": {
//       opacity: "0",
//     },
//     "100": {
//       opacity: "0",
//     },
//   },

//   selector: {
//     animation: "$fadeIn .2s ease-in-out",
//   },
// });

// const cartKeyframe = keyframes`
//   41%,
//   49%,
//   57%,
//   60% {
//     -webkit-transform: translateX(72px) rotate(0deg);
//     transform: translateX(72px) rotate(0deg);
//   }

//   40%,
//   47%,
//   54% {
//     -webkit-transform: translateX(72px) rotate(0deg) translateY(1px);
//     transform: translateX(72px) rotate(0deg) translateY(1px);
//   }

//   100% {
//     -webkit-transform: translateX(180px) rotate(-16deg);
//     transform: translateX(180px) rotate(-16deg);
//   }
// `;

// const dotKeyframe = keyframes`
//   5% {
//     -webkit-transform: translateY(0);
//     transform: translateY(0);
//   }
//   25% {
//     -webkit-transform: translateY(-20px) rotate(-32deg);
//     transform: translateY(-20px) rotate(-32deg);
//     box-shadow: 5px 0 0 var(--dots), 10px 0 0 var(--dots);
//   }
//   31% {
//     box-shadow: 5px -4px 0 var(--dots), 10px -8px 0 var(--dots);
//   }
//   32%,
//   50% {
//     -webkit-transform: translateY(0) rotate(0deg);
//     transform: translateY(0) rotate(0deg);
//     opacity: 1;
//   }
//   45%,
//   100% {
//     box-shadow: 5px 0 0 var(--dots), 10px 0 0 var(--dots);
//   }
//   51%,
//   100% {
//     opacity: 0;
//   }
// `;

// const labels: { [index: string]: string } = {
//   0.5: "Useless",
//   1: "Useless+",
//   1.5: "Poor",
//   2: "Poor+",
//   2.5: "Ok",
//   3: "Ok+",
//   3.5: "Good",
//   4: "Good+",
//   4.5: "Excellent",
//   5: "Excellent+",
// };

// function getLabelText(value: number) {
//   return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
// }

const Detail: React.FC = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [currentQuantities, setCurrentQuantities] = useState<number>(1);
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    console.log(id);
  }, [id]);

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
              backgroundColor: "lightgray",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
              padding: "10px",
              paddingLeft: "13px",
              cursor: "pointer",
              top: "43%",
              left: "5px",
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
              backgroundColor: "lightgray",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
              padding: "10px",
              paddingLeft: "13px",
              cursor: "pointer",
              top: "43%",
              right: "5px",
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
            {/* <Box
              sx={{
                width: 200,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Rating
                name="hover-feedback"
                value={mockProduct.rating}
                precision={0.5}
                getLabelText={getLabelText}
                emptyIcon={
                  <Star
                    style={{ color: "rgba(0, 0, 0, 0.2)" }}
                    fontSize="inherit"
                  />
                }
              />
              <Box sx={{ ml: 2 }}>
                {labels[Number(mockProduct.rating.toPrecision(1))]}
              </Box>
            </Box> */}
          </Box>
          <IconButton>
            <FavoriteBorder />
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
          <Divider sx={{ borderRightWidth: "3px", margin: "0 20px" }} />
          <Box sx={{ width: "40%" }}>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                Địa chỉ giao hàng
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FmdGood
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                  }}
                />
                <Typography>Chưa chọn địa chỉ giao hàng</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalAtm
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                  }}
                />
                <Typography>Thanh toán tiền mặt/Online</Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                Đổi trả & bảo hành
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Refresh
                  sx={{
                    padding: "4px",
                    fontSize: "18px",
                    color: "rgba(0, 0, 0, 0.54)",
                    alignSelf: "flex-start",
                    transform: "scaleX(-1)",
                  }}
                />
                <Typography>
                  7 ngày hoàn tiền miễn phí
                  <Typography sx={{ fontSize: "13px", color: "grey", lineHeight: "13px" }}>
                    Hoàn tiền sau 7-14 ngày
                  </Typography>
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontWeight: 600 }}>Được bán bởi</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Detail;
