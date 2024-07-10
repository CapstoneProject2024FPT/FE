import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { ProductAdmin } from "../../../models/products";
import "./ProductList.scss";
import { Box, Button, Chip, Drawer, Typography } from "@mui/material";
import ProductCard from "../../../components/product-card/ProductCard";
import ProductFilteredRow from "../../Filter/Products/FilterProducts";
import { GridFilterListIcon } from "@mui/x-data-grid";
import { Skeleton } from "antd";
import { ApiOrigin } from "../../../api/services/apiOrigin";
import { CategoryApi } from "../../../api/services/apiCategories";
import { BrandApi } from "../../../api/services/apiBrand";
import { CloseOutlined } from "@mui/icons-material";
import { ProductsFilterType } from "../../../constants/filter";
import { useLocation, useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const { apiGetList, apiGetMachine, loading } = MachineryApi();
  const { apiGetOrigin } = ApiOrigin();
  const { getCategoryName } = CategoryApi();
  const { getBrandName } = BrandApi();
  const [productListOriginName, setProductListOriginName] = useState<string[]>(
    []
  );
  const [productListCategoryName, setProductListCategoryName] = useState<
    string[]
  >([]);
  const [productListBrandName, setProductListBrandName] = useState<string[]>(
    []
  );
  const navigate = useNavigate();
  const location = useLocation();
  const fetchProducts = async () => {
    try {
      const apiResponse = await apiGetMachine("Available");
      const productList = apiResponse.data;
      setProducts(productList);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  const fetchProductsOriginNames = async () => {
    const response = await apiGetOrigin();
    const originName = response.data?.map((origin: any) => ({
      id: origin.id,
      name: origin.name,
    }));
    setProductListOriginName(originName);
  };

  const fetchProductsCategoryNames = async () => {
    const response = await getCategoryName();
    const categoryName = response?.map((category: any) => ({
      id: category.id,
      name: category.name,
    }));
    setProductListCategoryName(categoryName);
  };

  const fetchProductsBrandNames = async () => {
    const response = await getBrandName();
    const brandName = response?.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
    }));
    setProductListBrandName(brandName);
  };

  const getProductsFilterByID = (
    categoryId: string,
    newsListCategory: any[]
  ) => {
    const category = newsListCategory.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  const getFilterArray = (filter: { [key: string]: string[] }) => {
    const filterArray: { key: string; value: string }[] = [];
    for (const key in filter) {
      if (key !== "name") {
        filter[key]?.forEach((value) => {
          filterArray.push({ key, value });
        });
      }
    }
    return filterArray;
  };

  const filterArray = getFilterArray(filter);

  const updateURLSearchParams = (filter: any) => {
    const searchParams = new URLSearchParams();
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        searchParams.set(key, filter[key]);
      } else {
        searchParams.delete(key);
      }
    });
    const to = { pathname: location.pathname, search: searchParams.toString() };
    navigate(to, { replace: true });
  };

  const getProductFilteredData = async (params: any) => {
    try {
      const data = await apiGetList(params);
      // if(setProducts) setProducts(data);
      setProducts && setProducts(data);
    } catch (error) {
      console.error("lỗi");
    }
  };

  const handleResetFilters = () => {
    const resetFilter = {};
    setFilter(resetFilter);
    updateURLSearchParams(resetFilter);
    getProductFilteredData(resetFilter);
  };

  const handleClearFilter = (key: string, value: string) => {
    const updatedFilter = { ...filter };
    if (
      key === ProductsFilterType.OriginId ||
      key === ProductsFilterType.CategoryId ||
      key === ProductsFilterType.BrandId
    ) {
      updatedFilter[key] = updatedFilter[key].filter(
        (val: any) => val !== value
      );
      if (updatedFilter[key].length === 0) {
        delete updatedFilter[key];
      }
    } else if (key === "name") {
      updatedFilter[key] = ""; // Clear the Autocomplete filter
    }
    setFilter && setFilter(updatedFilter);
    updateURLSearchParams(updatedFilter);
    getProductFilteredData(updatedFilter);
  };

  useEffect(() => {
    fetchProducts();
    fetchProductsOriginNames();
    fetchProductsCategoryNames();
    fetchProductsBrandNames();
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderChips = () => {
    return (
      <>
        {filterArray.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "800",
                letterSpacing: "-1px",
                color: "#1976d2",
              }}
            >
              Đã chọn:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                flex: "3",
                marginLeft: "4px",
              }}
            >
              {filterArray.map(({ key, value }) => (
                <Chip
                  key={key + value}
                  label={
                    key === ProductsFilterType.OriginId
                      ? `Xuất xứ: ${getProductsFilterByID(
                          value,
                          productListOriginName
                        )}`
                      : key === ProductsFilterType.CategoryId
                      ? `Loại máy: ${getProductsFilterByID(
                          value,
                          productListCategoryName
                        )}`
                      : `Thương hiệu: ${getProductsFilterByID(
                          value,
                          productListBrandName
                        )}`
                  }
                  onDelete={() => handleClearFilter(key, value)}
                  sx={{ margin: "5px" }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                border: "1px solid rgba(25, 118, 210, 0.5)",
                padding: "4px",
                color: "#1976d2",
                borderRadius: "5px",
                "&:hover": {
                  cursor: "pointer",
                  border: "1px solid #1976d2",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
              onClick={handleResetFilters}
            >
              <CloseOutlined />
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                }}
              >
                Xóa tất cả
              </Typography>
            </Box>
          </Box>
        )}
      </>
    );
  };

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
          display: { xs: "none", md: "block" },
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
          setProducts={setProducts}
          filter={filter}
          setFilter={setFilter}
        />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Button
          variant="outlined"
          onClick={toggleDrawer(true)}
          sx={{
            borderRadius: "5px",
            "&:hover": {
              borderColor: "#1976d2",
              borderRadius: "5px",
            },
          }}
        >
          <GridFilterListIcon
            sx={{
              "&:hover": {
                color: "#1976d2",
                backgroundColor: "unset",
                borderRadius: "none",
              },
            }}
          />
          <Typography sx={{ marginLeft: "4px" }} className="hide-text-on-small">
            Lọc
          </Typography>
        </Button>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: "250px",
              padding: "20px",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              borderRadius: "5px",
              height: "100%",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 5px grey",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            <ProductFilteredRow
              setProducts={setProducts}
              filter={filter}
              setFilter={setFilter}
            />
          </Box>
        </Drawer>
      </Box>
      <Box sx={{ width: { xs: "100%", md: "80%" } }}>
        <Box
          sx={{
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
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              Các loại máy
            </Typography>
          </Box>
          {/* <Box sx={{ width: "50%", textAlign: "right" }}>
            <SortMenu />
          </Box> */}
        </Box>
        <Box
          sx={{
            minHeight: "64px",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>{renderChips()}</Box>
        </Box>
        {loading ? (
          <Skeleton />
        ) : (
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
        )}
      </Box>
    </Box>
  );
};

export default ProductList;
