import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { ProductAdmin } from "../../../models/products";
import { useNavigate } from "react-router-dom";
import "./ProductList.scss";
import { Box } from "@mui/material";
import ProductCard from "../../../components/product-card/ProductCard";

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
