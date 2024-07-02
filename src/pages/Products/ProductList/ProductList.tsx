import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { ProductAdmin } from "../../../models/products";
import "./ProductList.scss";
import { Box, Typography } from "@mui/material";
import ProductCard from "../../../components/product-card/ProductCard";
import ProductFilteredRow from "../../Filter/FilterProducts";
import SortMenu from "../../Sort/SortProducts";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductAdmin[]>();

  //api
  const { apiGetMachine } = MachineryApi();

  //----------------------------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const apiResponse = await apiGetMachine("Available");
      const productList = apiResponse.data;
      setProducts(productList);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    return () => {
      fetchProducts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productFiltered = products?.map((item) => item);

  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        flexDirection: "row",
        margin: "20px auto auto auto",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          borderRadius: "5px",
          width: "20%",
          minWidth: "200px",
          height: "100%",
          position: "sticky",
          top: 0,
        }}
      >
        <ProductFilteredRow
          listProduct={productFiltered}
          setProducts={setProducts}
        />
      </Box>
      <Box sx={{ width: "80%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "10px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <Typography
              sx={{
                textTransform: "uppercase",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Các loại máy
            </Typography>
          </Box>
          <Box sx={{ width: "50%", textAlign: "right" }}>
            <SortMenu />
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px",
            justifyContent: "space-between",
            width: "100%%",
            padding: "0 20px",
          }}
        >
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;
