/* eslint-disable react-hooks/exhaustive-deps */
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
  ThumbUpRounded,
  AddShoppingCartTwoTone,
  ProductionQuantityLimitsTwoTone,
} from "@mui/icons-material";
import "./ProductDetail.scss";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { MachineryApi } from "../../../api/services/apiMachinery";
import Zoom from "../../../components/zoomImageHover";
import { ProductDetailProps } from "../../../models/products";
import { formatMoney } from "../../../utils/fn";
import config from "../../../configs";
import { ApiFavourite } from "../../../api/services/apiFavourite";
import { useAuthContext } from "../../../context/AuthContext";
import { FavoriteListProps } from "../../../models/favourite";

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [currentQuantities, setCurrentQuantities] = useState<number>(1);
  const [product, setProduct] = useState<ProductDetailProps>();
  const [selectProductQuantity, setSelectProductQuantity] = useState<number>(0);
  const { apiGetMachineryID } = MachineryApi();
  const { apiAddFavourite, apiGetFavourite, apiDeleteFavourite } =
    ApiFavourite();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [favouriteList, setFavouriteList] = useState<FavoriteListProps>();
  //favurite
  const [isFavourite, setIsFavourite] = useState(false);

  let initQuantity = 0;

  const fetchProducts = async () => {
    try {
      if (id) {
        const existCart = localStorage.getItem("cart");
        const productQuantity = { ...product, currentQuantities, id: id };
        if (existCart) {
          const parseProduct = JSON.parse(existCart);
          const existProduct = parseProduct.findIndex(
            (p: { id: string | undefined }) => p.id === productQuantity.id
          );
          if (existProduct !== -1) {
            initQuantity = parseProduct[existProduct].currentQuantities;
          }
        }
        const response = await apiGetMachineryID(id);
        if (response.status === 200) {
          console.log("response.data: ", response.data)
          setProduct(response.data);
          setSelectProductQuantity(
            remainingQuantity(
              response.data.quantity?.Available,
              initQuantity
            ) || 0
          );
        } else {
          toast.error(config.MessageNotice.Error500);
        }
      } else {
        throw new Error("Loi");
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.ErrorGet);
    }
  };

  //handleRemoveFavorite
  const handleRemoveFavorite = async () => {
    const isFavourite = favouriteList?.machinery.find(
      (detail) => detail.id === product?.id
    );

    if (isFavourite) {
      const response = await apiDeleteFavourite(isFavourite.id);
      if (response.status === 200) {
        toast.success(response.data);
        GetFavourite();
        handleRed();
      }
    }
  };

  //add favourite
  const handleAddfavorite = async () => {
    if (authUser) {
      if (isFavourite) {
        handleRemoveFavorite();
        return;
      } else {
        if (product) {
          const params = {
            machineryId: product.id,
          };
          const response = await apiAddFavourite(params);
          if (response.status === 200) {
            toast.success(config.MessageNotice.FavouriteSucces);
            GetFavourite();
            handleRed();
          }
        }
      }
    } else {
      localStorage.setItem("historyPath", location.pathname);
      navigate(config.routes.login);
    }
  };

  const GetFavourite = async () => {
    const response = await apiGetFavourite();
    if (response.status === 200) {
      setFavouriteList(response.data);
    }
  };

  const handleRed = () => {
    const isFavourite = favouriteList?.machinery.some(
      (detail) => detail.id === product?.id
    );

    if (isFavourite === true) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const remainingQuantity = (quantityStock: any, quantityInCart: any) => {
    return quantityStock - quantityInCart;
  };

  useEffect(() => {
    fetchProducts();
    //scroll to top
    window.scrollTo(0, 0);
  }, []);

  //get favourite
  useEffect(() => {
    if (authUser) {
      GetFavourite();
    }
  }, [authUser]);

  useEffect(() => {
    if (favouriteList) {
      handleRed();
    }
  }, [favouriteList]);

  const addToCart = () => {
    const existCart = localStorage.getItem("cart");
    const productQuantity = { ...product, currentQuantities, id: id };
    if (existCart) {
      const parseProduct = JSON.parse(existCart);
      const existProduct = parseProduct.findIndex(
        (p: { id: string | undefined }) => p.id === productQuantity.id
      );
      if (existProduct !== -1) {
        if (selectProductQuantity === 0) {
          toast.error(config.MessageNotice.OutOfStock);
          return;
        } else {
          parseProduct[existProduct].currentQuantities += currentQuantities;
        }
      } else {
        parseProduct.push(productQuantity);
      }
      toast.success(config.MessageNotice.AddProductToCartSuccess);
      localStorage.setItem("cart", JSON.stringify(parseProduct));
    } else {
      localStorage.setItem("cart", JSON.stringify([productQuantity]));
      toast.success(config.MessageNotice.AddProductToCartSuccess);
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
    color: isFavourite ? "blue" : "gray",
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
        width: "80%",
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
            width: "25%",
            height: "100%",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
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
            sx={{
              width: "100%",
              height: "50%",
              overflow: "hidden",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            cols={Math.min((product?.image || []).length, 3)}
            rowHeight={164}
          >
            {(product?.image || [])?.map(({ imageURL }, index) => (
              <ImageListItem
                key={index}
                sx={{
                  width: "170px",
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
        <Divider
          orientation="horizontal"
          flexItem
          sx={{ margin: "10px", border: "1px solid #d9d9d9" }}
        />

        <Box sx={{ width: "70%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h4">{product?.name}</Typography>
            </Box>
            <IconButton onClick={handleAddfavorite} aria-label="favourite">
              <ThumbUpRounded style={buttonStyle} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", margin: "10px 0" }}>
            <Typography sx={{ paddingRight: "30px" }}>
              {`Thương hiệu: `}
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
                width: "50%",
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
                {product
                  ? formatMoney(
                    (product?.sellingPrice * (100 - product?.discount)) / 100
                  )
                  : 0}
              </Typography>

              {product?.discount ? (
                <>
                  {/* Original Price */}
                  <Typography
                    sx={{
                      color: "gray",
                      textDecoration: "line-through",
                    }}
                    variant="h5"
                  >
                    {formatMoney(product?.sellingPrice)}
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
                    {product?.discount}
                  </Typography>
                </>
              ) : null}
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
                      className={`${currentQuantities >= (selectProductQuantity ?? 0) &&
                        "disabled"
                        }`}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                Hiện có: {selectProductQuantity}
              </Box>
              {selectProductQuantity === 0 ? (
                <Button
                  variant="outlined"
                  onClick={addToCart}
                  disabled={selectProductQuantity === 0}
                  sx={{
                    marginTop: "20px",
                    border: "1px solid red !important",
                    borderRadius: "10px",
                    width: "200px",
                    height: "60px",
                    transition: "0.3s ease-in-out",
                  }}
                  startIcon={
                    <ProductionQuantityLimitsTwoTone sx={{ color: "red" }} />
                  }
                >
                  <Typography sx={{ color: "red" }}>Đã hết hàng</Typography>
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={addToCart}
                  disabled={selectProductQuantity === 0}
                  sx={{
                    marginTop: "20px",
                    borderRadius: "10px",
                    width: "200px",
                    height: "60px",
                    transition: "0.3s ease-in-out",
                    cursor: "pointer",
                  }}
                  startIcon={<AddShoppingCartTwoTone />}
                >
                  <Typography>Thêm vào giỏ</Typography>
                </Button>
              )}
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
            <Typography sx={{ marginLeft: "20px", flex: "1.5 !important" }}>{item.name}</Typography>
            <Divider orientation="vertical" flexItem />
            <Typography sx={{ marginLeft: "20px", flex: "2 !important" }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Divider sx={{ borderBottomWidth: "5px", margin: "20px 0" }} />
        <Box>
          <Typography
            variant="h5"
            sx={{ margin: "10px 0", fontWeight: "bold" }}
          >
            Bộ phận máy: {product?.name}
          </Typography>
        </Box>
        {product?.component.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
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
            <Typography sx={{ marginLeft: "20px", flex: "1.5 !important" }}>{item.name}</Typography>
            <Divider orientation="vertical" flexItem />
            <Typography sx={{ marginLeft: "10px", flex: "2 !important" }}>{item.description} {item.sellingPrice > 0 && (
              <Box sx={{ display: "inline-flex" }}><span style={{
                color: "red",
                marginLeft: "10px",
                fontWeight: "800",
              }}> ( </span><span style={{
                color: "red",
                fontWeight: "800",
                lineHeight: "30px"
              }}> * </span>
                <span style={{
                  color: "red",
                  fontWeight: "800",
                }}> ) </span></Box>
            )}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ marginTop: "30px" }}>
        <Typography sx={{ fontSize: "18px", color: "red" }}>
          Lưu ý:
        </Typography>
        <Typography sx={{ fontSize: "18px", marginLeft: "50px", color: "red" }}>
          <Box sx={{ display: "inline-flex" }}><span style={{
            color: "red",
            marginLeft: "10px",
            fontWeight: "800",
          }}> ( </span><span style={{
            color: "red",
            fontWeight: "800",
            lineHeight: "30px"
          }}> * </span>
            <span style={{
              color: "red",
              fontWeight: "800",
            }}>) </span></Box>
           :{" "}Các bộ phận này sẽ bị thu phí khi bảo hành.
        </Typography>
      </Box>
    </Box>
  );
};

export default Detail;
