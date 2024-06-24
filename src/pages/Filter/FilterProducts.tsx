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

interface ProductFilterProps {
  listProduct: any;
}

interface ProductFilter {
  [key: string]: string[];
  // other properties
}

const ProductFilteredRow: React.FC<ProductFilterProps> = ({ listProduct }) => {
  const [filter, setFilter] = useState<ProductFilter>({});
  const navigate = useNavigate();

  const handleCategoryChange = (
    filterType: PRODUCT_FILTER,
    value: string,
    checked: boolean
  ) => {
    const item = filter[filterType] || [];
    if (checked) {
      filter[filterType] = [...item, value];
    } else {
      filter[filterType] = item.filter((val) => val !== value);
    }

    setFilter(filter);
    updateURLSearchParams(filter);
  };

  const updateURLSearchParams = (filter: ProductFilter) => {
    const params = new URLSearchParams();

    for (const key in filter) {
      if (filter[key].length > 0) {
        params.set(key, filter[key].join(","));
      }
    }

    const to = { pathname: location.pathname, search: params.toString() };
    navigate(to, { replace: true });
  };

  const getFilteredData = () => {

  }

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
    console.log(initialFilter);
  }, []);

  /* filter origin */
  const uniqueOrigins = [
    ...new Set(listProduct?.map((item: any) => item.origin)),
  ];

  /* filter category */
  const uniqueCategory = [
    ...new Set(listProduct?.map((item: any) => item.category.name)),
  ];

  /* filter warranty */
  const uniqueWarranties = [
    ...new Set(listProduct?.map((item: any) => item.timeWarranty.toString())),
  ];

  /* filter brand */
  const uniqueBrand = [...new Set(listProduct?.map((item: any) => item.brand))];

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
            {uniqueOrigins.map((origin: any) => (
              <FormControlLabel
                key={origin}
                control={
                  <Checkbox
                    // checked={selectedCategories.includes(origin)}
                    onChange={(_, checked) =>
                      handleCategoryChange(
                        PRODUCT_FILTER.ORIGIN,
                        origin,
                        checked
                      )
                    }
                    name={origin}
                  />
                }
                label={origin}
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
          Loại
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
            {uniqueCategory.map((category: any) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    onChange={(_, checked) =>
                      handleCategoryChange(
                        PRODUCT_FILTER.CATEGORY,
                        category,
                        checked
                      )
                    }
                    name={category}
                  />
                }
                label={category}
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
            {uniqueBrand.map((brand: any) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    onChange={(_, checked) =>
                      handleCategoryChange(PRODUCT_FILTER.BRAND, brand, checked)
                    }
                    name={brand}
                  />
                }
                label={brand}
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
          Hạn bảo hành
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
            {uniqueWarranties.map((warranty: any) => (
              <FormControlLabel
                key={warranty}
                control={
                  <Checkbox
                    onChange={(_, checked) =>
                      handleCategoryChange(
                        PRODUCT_FILTER.WARRANTY,
                        warranty,
                        checked
                      )
                    }
                    name={warranty}
                  />
                }
                label={`${warranty} Tháng`}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
    </FormControl>
  );
};

export default ProductFilteredRow;
