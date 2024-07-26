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
import {
  ArrowBackIos,
  ArrowForwardIos,
  Refresh,
  Verified,
  LocalPolice,
  FavoriteSharp,
} from "@mui/icons-material";
import "./ProductDetail.scss";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { MachineryApi } from "../../../api/services/apiMachinery";
import Zoom from "../../../components/zoomImageHover";
import { ProductDetailProps } from "../../../models/products";
import { formatMoney } from "../../../utils/fn";

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [currentQuantities, setCurrentQuantities] = useState<number>(1);
  const [isRed, setIsRed] = useState(false);
  const [product, setProduct] = useState<ProductDetailProps>();
  const [selectProductQuantity, setSelectProductQuantity] = useState<number>(0);
  const { apiGetMachineryID } = MachineryApi();
  const [initQuantity, setInitQuantity] = useState<number>(0);
  let restQuantity = 0;
  // let initQuantity = 0
  const fetchProducts = async () => {
    try {
      if (id) {
        const response = await apiGetMachineryID(id);
        if (response.status === 200) {
          setProduct(response.data);
          setSelectProductQuantity(response.data.quantity?.Available || 0);
        } else {
          toast.error("Có lỗi trong quá trình lấy");
        }
      } else {
        throw new Error("Loi");
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchProducts();
    //scroll to top
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickButton = () => {
    setIsRed(!isRed);
  };

  const addToCart = () => {
    if (selectProductQuantity === 0) {
      toast.error("Sản phẩm hiện không còn");
      return;
    }
    const existCart = localStorage.getItem("cart");
    const productQuantity = { ...product, currentQuantities, id: id };
    if (existCart) {
      const parseProduct = JSON.parse(existCart);
      const existProduct = parseProduct.findIndex(
        (p: { id: string | undefined }) => p.id === productQuantity.id
      );
      if (existProduct !== -1) {
        restQuantity = initQuantity;
        if (restQuantity === 0) {
          toast.error("Bạn đã thêm toàn bộ sản phẩm vào trong Giỏ hàng");
          return;
        }
        parseProduct[existProduct].currentQuantities += currentQuantities;
        toast.success("Thêm sản phẩm thành công");
      } else {
        parseProduct.push(productQuantity);
        console.log("KHÔNG: ");
        setInitQuantity(selectProductQuantity - 1);
        toast.success("Thêm sản phẩm thành công");
      }
      localStorage.setItem("cart", JSON.stringify(parseProduct));
    } else {
      localStorage.setItem("cart", JSON.stringify([productQuantity]));
      setInitQuantity(selectProductQuantity)
      toast.success("Thêm sản phẩm thành công");
    }

    // Update the selectProductQuantity state
    setSelectProductQuantity(
      (prevQuantity) => prevQuantity - currentQuantities
    );
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
  const onChangeQuantities = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === "" || re.test(value)) {
      let newValue = Number(value);
      setCurrentQuantities(newValue);
      if (newValue <= 1) {
        setCurrentQuantities(1);
      } else if (newValue > selectProductQuantity) {
        newValue = selectProductQuantity;
      }
      setCurrentQuantities(newValue);
    }
  };

  const increaseQuantity = () => {
    if (
      selectProductQuantity === 0 ||
      currentQuantities === selectProductQuantity
    )
      return;
    setCurrentQuantities(currentQuantities + 1);
  };

  const decreaseQuantity = () => {
    if (selectProductQuantity === 0 || currentQuantities === 1) return;
    setCurrentQuantities(currentQuantities - 1);
  };

  return (
    <Box
      sx={{
        width: "90%",
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            width: "35%",
            height: "100%",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
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
                    ? (product?.image || []).length - 1
                    : selectedImage - 1
                )
              }
            />
            <Zoom
              className="product-images"
              src={
                product?.image[selectedImage].imageURL ||
                "https://via.placeholder.com/150"
              }
              width="unset"
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
                  selectedImage === (product?.image || "").length - 1
                    ? 0
                    : selectedImage + 1
                )
              }
            />
          </Box>

          <ImageList
            sx={{ width: "100%", height: "100%", overflow: "hidden" }}
            cols={3}
            rowHeight={164}
          >
            {(product?.image || [])?.map(({ imageURL }, index) => (
              <ImageListItem
                key={index}
                sx={{
                  cursor: "pointer",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                <img
                  src={imageURL}
                  alt={imageURL}
                  loading="lazy"
                  onClick={() => setSelectedImage(index)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        <Box sx={{ width: "60%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h4">{product?.name}</Typography>
            </Box>
            <IconButton onClick={handleClickButton} aria-label="favourite">
              <FavoriteSharp style={buttonStyle} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", margin: "10px 0" }}>
            <Typography sx={{ paddingRight: "30px" }}>
              Thương hiệu:
              <Typography
                component={"span"}
                sx={{ cursor: "pointer", color: "blue" }}
              >
                {/* TODO: sau có brand thì change từ model về brand */}
                {product?.brand?.name}
              </Typography>
            </Typography>

            <Typography sx={{ color: "lightgrey" }}>
              Mẫu mã: {product?.model}
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
                }}
                variant="h4"
              >
                {/* TODO: Selling price when have promotion */}
                {/* {(product?.sellingPrice * (100 - product.discountPercentage)) / 100} */}
                {formatMoney(product?.sellingPrice)}
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
                {product?.sellingPrice}
              </Typography>
              <Typography
                sx={{
                  color: "red",
                  "&:after": { content: "'%'" },
                  "&:before": { content: "'-'" },
                }}
                variant="h5"
              >
                {/* TODO: sau có promotion thì update lại */}
                {/* {product?.discountPercentage} */}
                50
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
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
                        "&.disabled:hover": {
                          cursor: "not-allowed",
                        },
                      }}
                      onClick={() => increaseQuantity()}
                      className={`${
                        currentQuantities >= (selectProductQuantity ?? 0) &&
                        "disabled"
                      }`}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                Hiện có: {selectProductQuantity}
              </Box>

              <Button
                onClick={addToCart}
                sx={{
                  marginTop: "20px",
                  position: "relative",
                  width: "200px",
                  height: "60px",
                  border: "0",
                  borderRadius: "10px",
                  backgroundColor: "#4834d4",
                  outline: "none",
                  color: "#fff",
                  transition: "0.3s ease-in-out",
                  overflow: "hidden",
                  cursor:
                    selectProductQuantity === 0 ? "not-allowed" : "pointer",
                  "&:hover": {
                    backgroundColor: "#35269b",
                  },

                  "&:active": {
                    transform: "scale(0.9)",
                  },
                }}
              >
                <span className="add-to-cart">Thêm vào giỏ</span>
              </Button>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ margin: "0 8px" }} />
            <Box
              sx={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <Box sx={{ margin: "auto" }}>
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
                      fontSize: "28px",
                      color: "rgba(0, 0, 0, 0.54)",
                      alignSelf: "flex-start",
                      transform: "scaleX(-1)",
                      marginRight: "8px",
                    }}
                  />
                  <Box>
                    <Typography>7 ngày hoàn tiền miễn phí</Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "grey",
                        lineHeight: "13px",
                      }}
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
                      fontSize: "28px",
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
                      fontSize: "28px",
                      color: "rgba(0, 0, 0, 0.54)",
                      alignSelf: "flex-start",
                      marginRight: "8px",
                    }}
                  />
                  <Typography>Bảo hành định kỳ</Typography>
                </Box>
              </Box>
              <Divider sx={{ borderBottomWidth: "1px", margin: "0 10px" }} />
              <Box sx={{ margin: "auto" }}>
                <Typography sx={{ fontWeight: 600 }}>Được bán bởi</Typography>
                <Typography
                  sx={{ fontWeight: 600, color: "orange", marginTop: "8px" }}
                >
                  SMMMS Corporation
                </Typography>
              </Box>
              <Divider sx={{ borderBottomWidth: "1px", margin: "0 10px" }} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Divider sx={{ borderBottomWidth: "5px", margin: "20px 0" }} />
        <Box>
          <Typography
            variant="h5"
            sx={{ margin: "10px 0", fontWeight: "bold" }}
          >
            Thông số: {product?.name}
          </Typography>
        </Box>
        {product?.specifications.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              border: "1px solid #dee2e6",
              alignItems: "center",

              "& p": { flex: "1 1 50%", padding: "5px" },
              "& ": {
                backgroundColor: "#F2F2F2",
                borderRight: "1px solid #dee2e6",
                textTransform: "capitalize",
              },
            }}
          >
            <Typography>{item.name}</Typography>
            <Typography>{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Detail;
