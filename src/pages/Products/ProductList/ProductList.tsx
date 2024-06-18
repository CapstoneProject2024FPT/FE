import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { toast } from "react-toastify";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { ProductAdmin } from "../../../models/products";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../configs/routes";
import "./ProductList.scss";
import suffix from "../../../configs/suffixRoute";
import { Box, Typography } from "@mui/material";

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
      const apiResponse = await apiGetMachine("Active");
      setProducts(apiResponse.data);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  console.log(customPagination, handleSearch, navigate);

  const filteredRows = products?.filter((item) =>
    item.name?.toLowerCase().includes(query)
  );
  interface ProductCardProps {
    product: ProductAdmin;
  }

  const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          padding: "20px",
          borderRadius: "5px",
          width: "100%",
          height: "100%",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          cursor: "pointer",
        }}
      >
        <Box
          component="img"
          alt={product.name}
          src={product.image[0]?.imageURL}
          sx={{ width: "100%", height: "200px", objectFit: "contain" }}
        />

        <Box sx={{ width: "100%" }}>
          <Box>
            <Typography variant="h6" sx={{ textWrap: "wrap" }}>
              Tên: {product.name}
            </Typography>
            <Typography variant="subtitle1">Loại: {product.model}</Typography>
            <Typography variant="subtitle1">
              Xuất xứ: {product.origin}
            </Typography>
            <Typography variant="subtitle1">
              Số lượng: {product.quantity || 0}
            </Typography>
          </Box>
          <Box sx={{ margin: "10px 0", textAlign: "right" }}>
            <Button
              onClick={() =>
                navigate(
                  routes.productDetail.replace(suffix.detailId, product.id)
                )
              }
            >
              Chi tiết
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* <Search
        placeholder="Tìm kiếm"
        onChange={handleSearch}
        style={{ padding: "0 10%", height: "40px" }}
      /> */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          width: "90%",
          gap: "50px",
          justifyContent: "space-between",
          margin: "auto",
        }}
      >
        {filteredRows?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default ProductList;
