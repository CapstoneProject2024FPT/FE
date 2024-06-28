import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { ProductAdmin } from "../../../models/products";
import { useNavigate } from "react-router-dom";
import "./ProductList.scss";
import { Box, Typography } from "@mui/material";
import ProductCard from "../../../components/product-card/ProductCard";
import ProductFilteredRow from "../../Filter/FilterProducts";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import { SortOutlined } from "@mui/icons-material";
import MenuListComposition from "../../Sort/SortProducts";
import SortMenu from "../../Sort/SortProducts";
const pageSize = 20;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductAdmin[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");

  //api
  const { apiGetMachine } = MachineryApi();

  //----------------------------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const apiResponse = await apiGetMachine("Available");
      setProducts(apiResponse.data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    return () => {
      fetchProducts();
    };
  }, []);

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setProducts([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"], // Custom page size options
    showSizeChanger: false, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredRows = products?.filter((item) =>
    item.name?.toLowerCase().includes(query)
  );
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
          {filteredRows?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;
