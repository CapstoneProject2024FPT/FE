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
import { PRODUCT_FILTER } from "../../constants/filter";
import { useNavigate } from "react-router-dom";
import { MachineryApi } from "../../api/services/apiMachinery";
import { ProductAdmin } from "../../models/products";
import { CategoryApi } from "../../api/services/apiCategories";
import { BrandApi } from "../../api/services/apiBrands";
import { ApiOrigin } from "../../api/services/apiOrigin";

interface ProductFilterProps {
  listProduct: any;
  setProducts: React.Dispatch<React.SetStateAction<ProductAdmin[] | undefined>>;
}

interface ProductFilter {
  [key: string]: string[];
  // other properties
}

const ProductFilteredRow: React.FC<ProductFilterProps> = ({
  listProduct,
  setProducts,
}) => {
  const { apiGetList } = MachineryApi();
  const { apiGetOrigin } = ApiOrigin();
  const { getCategoryName } = CategoryApi();
  const { getBrandName } = BrandApi();

  const [filter, setFilter] = useState<any>({});
  const [listOriginName, setListOriginName] = useState<string[]>([]);
  const [listCategoryName, setListCategoryName] = useState<string[]>([]);
  const [listBrandName, setListBrandName] = useState<string[]>([]);
  const navigate = useNavigate();

  // origin
  const fetchOriginNames = async () => {
    const response = await apiGetOrigin();
    console.log(response)
    const originName = response.data?.map((origin: any) => ({
      id: origin.id,
      name: origin.name,
    }));
    console.log(originName)
    setListOriginName(originName);
  };

  // category
  const fetchCategoryNames = async () => {
    const response = await getCategoryName();
    const categoryName = response?.map((category: any) => ({
      id: category.id,
      name: category.name,
    }));
    setListCategoryName(categoryName);
  };

  // brand
  const fetchBrandNames = async () => {
    const response = await getBrandName();
    const brandName = response?.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
    }));
    setListBrandName(brandName);
  };

  const handleCategoryChange = (
    filterType: PRODUCT_FILTER,
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
    getFilteredData(filter);
    updateURLSearchParams(filter);
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

  const getFilteredData = async (params: any) => {
    try {
      const data = await apiGetList(params);
      setProducts(data);
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

  // Initialize filter state from URL on component mount
  useEffect(() => {
    const initialFilter = getFilterFromURL();
    setFilter(initialFilter);
    getFilteredData(initialFilter);
    fetchOriginNames();
    fetchCategoryNames();
    fetchBrandNames();
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
            maxHeight: "135px",
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
            {listOriginName.map((origin: any) => (
              <FormControlLabel
                key={`${origin?.id}`}
                control={
                  <Checkbox
                    defaultChecked={filter[PRODUCT_FILTER.ORIGINID]?.includes(
                      origin.id
                    )}
                    onChange={(checked) =>
                      handleCategoryChange(
                        PRODUCT_FILTER.ORIGINID,
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
            maxHeight: "135px",
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
            {listCategoryName.map((category: any) => (
              <FormControlLabel
                key={`${category?.id}`}
                control={
                  <Checkbox
                    defaultChecked={filter[PRODUCT_FILTER.CATEGORYID]?.includes(
                      category.id
                    )}
                    onChange={(checked) =>
                      handleCategoryChange(
                        PRODUCT_FILTER.CATEGORYID,
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
            maxHeight: "135px",
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
            {listBrandName.map((brand: any) => (
              <FormControlLabel
                key={`${brand?.id}`}
                control={
                  <Checkbox
                    defaultChecked={filter[PRODUCT_FILTER.BRANDID]?.includes(
                      brand.id
                    )}
                    onChange={(checked) =>
                      handleCategoryChange(
                        PRODUCT_FILTER.BRANDID,
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
