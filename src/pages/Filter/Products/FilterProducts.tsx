/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";

import "./FilterProducts.scss";
import { ProductsFilterType } from "../../../constants/filter";
import { useNavigate } from "react-router-dom";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { ProductAdmin } from "../../../models/products";
import { CategoryApi } from "../../../api/services/apiCategories";
import { BrandApi } from "../../../api/services/apiBrand";
import { ApiOrigin } from "../../../api/services/apiOrigin";

interface ProductFilterProps {
  setProducts?: React.Dispatch<React.SetStateAction<ProductAdmin[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProductFilter {
  [key: string]: string[];
}

const ProductFilteredRow: React.FC<ProductFilterProps> = ({
  setProducts,
  setLoading,
}) => {
  const { apiGetList, loading } = MachineryApi();
  const { apiGetOrigin } = ApiOrigin();
  const { getCategoryName } = CategoryApi();
  const { getBrandName } = BrandApi();
  const [filter, setFilter] = useState<any>({});
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

  const handleFilterProducts = (
    filterType: ProductsFilterType,
    value: string,
    checked: boolean
  ) => {
    const item = filter[filterType] || [];
    if (checked) {
      filter[filterType] = [...item, value];
    } else {
      filter[filterType] = item.filter((val: any) => val !== value);
    }
    setFilter(filter);
    updateURLSearchParams(filter);
    getProductFilteredData(filter);
  };

  const updateURLSearchParams = (filter: any) => {
    const params = new URLSearchParams();
    for (const key in filter) {
      if (filter[key].length > 0) {
        params.set(key, filter[key].join(","));
      }
    }
    const to = { pathname: location.pathname, search: params.toString() };
    navigate(to, { replace: true });
  };

  const getProductFilteredData = async (params: any) => {
    try {
      const data = await apiGetList(params);
      // if(setProducts) setProducts(data);
      setProducts && setProducts(data);
      setLoading(loading);
    } catch (error) {
      console.error("lỗi");
    }
  };

  const getFilterFromURL = (): ProductFilter => {
    const params = new URLSearchParams(window.location.search);
    const newFilter: ProductFilter = {};
    params.forEach((value, key) => {
      newFilter[key] = value.split(",");
    });
    return newFilter;
  };

  useEffect(() => {
    const initialFilter = getFilterFromURL();
    setFilter(initialFilter);
    getProductFilteredData(initialFilter);
    fetchProductsOriginNames();
    fetchProductsCategoryNames();
    fetchProductsBrandNames();
  }, []);

  return (
    <FormControl
      component="fieldset"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "12px",
      }}
    >
      {/* showProductsOriginFilter */}
      <Box>
        <FormLabel
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "black !important",
          }}
        >
          Xuất xứ
        </FormLabel>
        <Box
          sx={{
            maxHeight: "200px",
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
          <FormGroup sx={{ paddingLeft: "20px" }}>
            {productListOriginName.map((origin: any) => (
              <FormControlLabel
                key={`${origin?.id}`}
                control={
                  <Checkbox
                    defaultChecked={filter[
                      ProductsFilterType.OriginId
                    ]?.includes(origin.id)}
                    onChange={(checked) =>
                      handleFilterProducts(
                        ProductsFilterType.OriginId,
                        origin.id,
                        checked.target.checked
                      )
                    }
                    name={`${origin?.name}`}
                  />
                }
                label={`${origin?.name}`}
                style={{ fontSize: "10px" }}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>

      {/* showProductsCategoryFilter */}
      <Box>
        <FormLabel
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "black !important",
          }}
        >
          Loại máy
        </FormLabel>
        <Box
          sx={{
            maxHeight: "200px",
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
          <FormGroup sx={{ paddingLeft: "20px" }}>
            {productListCategoryName.map((category: any) => (
              <FormControlLabel
                key={`${category?.id}`}
                control={
                  <Checkbox
                    defaultChecked={filter[
                      ProductsFilterType.CategoryId
                    ]?.includes(category.id)}
                    onChange={(checked) =>
                      handleFilterProducts(
                        ProductsFilterType.CategoryId,
                        category.id,
                        checked.target.checked
                      )
                    }
                    name={`${category?.name}`}
                  />
                }
                label={`${category?.name}`}
                style={{ fontSize: "10px" }}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>

      {/* showProductsBrandFilter */}
      <Box>
        <FormLabel
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "black !important",
          }}
        >
          Thương hiệu
        </FormLabel>
        <Box
          sx={{
            maxHeight: "200px",
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
          <FormGroup sx={{ paddingLeft: "20px" }}>
            {productListBrandName.map((brand: any) => (
              <FormControlLabel
                key={`${brand?.id}`}
                control={
                  <Checkbox
                    defaultChecked={filter[
                      ProductsFilterType.BrandId
                    ]?.includes(brand.id)}
                    onChange={(checked) =>
                      handleFilterProducts(
                        ProductsFilterType.BrandId,
                        brand.id,
                        checked.target.checked
                      )
                    }
                    name={`${brand?.name}`}
                  />
                }
                label={`${brand?.name}`}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
    </FormControl>
  );
};

export default ProductFilteredRow;
