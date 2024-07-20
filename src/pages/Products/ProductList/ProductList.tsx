/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { GetProductProps, ProductAdmin } from "../../../models/products";
import "./ProductList.scss";
import { Box, Button, Chip, Container, Drawer, Paper, TableContainer, TablePagination, Typography } from "@mui/material";
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
import { useFilterContext } from "../../../context/FilterContext";

interface ProductFilter {
  [key: string]: string[];
}

const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<ProductFilter>();
  const { apiGetList, apiGetMachine } = MachineryApi();
  const { apiGetOrigin } = ApiOrigin();
  const { getCategoryName } = CategoryApi();
  const { getBrandName } = BrandApi();

  const { data } = useFilterContext();
  const [productQuantity, setProductQuantity] = useState<GetProductProps>();
  const [page, setPage] = useState<number>(0);
  const [, setRowsPerPage] = useState(15);
  const routePage = [15, 20, 25, 30];

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [productListOriginName, setProductListOriginName] = useState<string[]>(
    []
  );
  const [productListCategoryName, setProductListCategoryName] = useState<
    string[]
  >([]);
  const [productListBrandName, setProductListBrandName] = useState<string[]>(
    []
  );
  const [productListName, setProductListName] = useState<string[]>([]);
  console.log(productListName);

  const [isReset, setIsReset] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Product - origin
  const fetchProductsOriginNames = async () => {
    const response = await apiGetOrigin();
    const originName = response.data?.map((origin: any) => ({
      id: origin.id,
      name: origin.name,
    }));
    setProductListOriginName(originName);
  };

  // Product - category
  const fetchProductsCategoryNames = async () => {
    const response = await getCategoryName();
    const categoryName = response?.map((category: any) => ({
      id: category.id,
      name: category.name,
    }));
    setProductListCategoryName(categoryName);
  };

  // Product - brand
  const fetchProductsBrandNames = async () => {
    const response = await getBrandName();
    const brandName = response?.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
    }));
    setProductListBrandName(brandName);
  };

  const fetchProductListName = async () => {
    const response = await apiGetMachine("Available");
    const productName = response.data.items.map(
      (productName: { name: any }) => productName.name
    );
    const productQuantity = response.data;
    setProductListName(productName);
    setProductQuantity(productQuantity);
  };

  useEffect(() => {
    fetchProductsOriginNames();
    fetchProductsCategoryNames();
    fetchProductsBrandNames();
    fetchProductListName();

    setFilter(getFilterFromURL());
  }, []);

  // Get Products
  const getFilterFromURL = (): ProductFilter => {
    const params = new URLSearchParams(window.location.search);
    const newFilter: ProductFilter = {};
    params.forEach((value, key) => {
      newFilter[key] = value.split(",");
    });
    return newFilter || {};
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

  const filterArray = getFilterArray(filter as any);

  const updateURLSearchParams = (filter?: any) => {
    const searchParams = new URLSearchParams();
    Object.keys(filter)?.forEach((key) => {
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
      setProducts(data);
    } catch (error) {
      console.error("lỗi");
    }
  };

  const handleResetFilters = () => {
    setFilter({});
    setIsReset(true);
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
      updatedFilter[key] = "" as any; // Clear the Autocomplete filter
    }
    setFilter({});
    setIsReset(true);
    updateURLSearchParams(updatedFilter);
    getProductFilteredData(updatedFilter);
  };

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const getChipLabel = (key: string, value: string) => {
    switch (key) {
      case ProductsFilterType.OriginId:
        return `Xuất xứ: ${getProductsFilterByID(
          value,
          productListOriginName
        )}`;
      case ProductsFilterType.CategoryId:
        return `Loại máy: ${getProductsFilterByID(
          value,
          productListCategoryName
        )}`;
      case ProductsFilterType.BrandId:
        return `Thương hiệu: ${getProductsFilterByID(
          value,
          productListBrandName
        )}`;
      default:
        return value; // Return value directly if no condition matches
    }
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

  useEffect(() => {
    // execute on location change

    if (filter !== undefined) {
      getProductFilteredData(filter);
      updateURLSearchParams(filter);
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const filter = data || getFilterFromURL();
    getProductFilteredData(filter);
    setFilter(filter);
    setIsReset(true);
  }, [data]);

  const renderChips = () => {
    const hasSpecialFilters = filterArray.some(({ key }) =>
      [
        ProductsFilterType.OriginId,
        ProductsFilterType.CategoryId,
        ProductsFilterType.BrandId,
      ].includes(key as ProductsFilterType)
    );

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
              {hasSpecialFilters ? "Đã chọn:" : "Đã tìm:"}
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
                  label={getChipLabel(key, value)}
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
    <Container maxWidth="xl">
      <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            width: "90%",
            display: "flex",
            flexDirection: "row",
            margin: "20px",
            gap: "60px",
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
            {loading ? (
              <Skeleton />
            ) : (
              <ProductFilteredRow
                filter={filter}
                setFilter={setFilter}
                isReset={isReset}
                setIsReset={setIsReset}
                productListOriginName={productListOriginName}
                productListCategoryName={productListCategoryName}
                productListBrandName={productListBrandName}
              />
            )}
          </Box>
          {/* filter reponsive  */}
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
              <Typography
                sx={{ marginLeft: "4px" }}
                className="hide-text-on-small"
              >
                Lọc
              </Typography>
            </Button>
            <Drawer
              anchor="left"
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
            >
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
                {loading ? (
                  <Skeleton />
                ) : (
                  <ProductFilteredRow
                    filter={filter}
                    setFilter={setFilter}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    productListOriginName={productListOriginName}
                    productListCategoryName={productListCategoryName}
                    productListBrandName={productListBrandName}
                  />
                )}
              </Box>
            </Drawer>
          </Box>

          {/* ---------------------------------------- */}

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
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {renderChips()}
              </Box>
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
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={routePage}
        component="div"
        count={productQuantity?.total ? productQuantity?.total : 0}
        rowsPerPage={productQuantity?.size ?? 0}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang"
      ></TablePagination>
    </Container>
  );
};

export default ProductList;
