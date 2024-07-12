import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  Autocomplete,
  TextField,
} from "@mui/material";

import "./FilterProducts.scss";
import { ProductsFilterType } from "../../../constants/filter";

interface ProductFilterProps {
  filter: any;
  setFilter: React.Dispatch<any>;
  isReset: boolean;
  setIsReset: (value: React.SetStateAction<boolean>) => void;

  productListOriginName: string[];
  productListCategoryName: string[];
  productListBrandName: string[];
  productListName: string[];
}

const ProductFilteredRow: React.FC<ProductFilterProps> = ({
  filter = {},
  setFilter,
  isReset,
  setIsReset,

  productListOriginName,
  productListCategoryName,
  productListBrandName,
  productListName,
}) => {
  const [filterOrigin, setFilterOrigin] = useState<string[]>(
    filter[ProductsFilterType.OriginId] || []
  );
  const [filterCategoty, setFilterCategoty] = useState<string[]>(
    filter[ProductsFilterType.CategoryId] || []
  );
  const [filterBrand, setFilterBrand] = useState<string[]>(
    filter[ProductsFilterType.BrandId] || []
  );

  const [, setIsCheckboxChange] = useState<boolean>(false);

  const [, setSearchTerm] = useState<string>();

  const handleFilterProducts = (
    filterType: ProductsFilterType,
    value: string,
    checked: boolean
  ) => {
    switch (filterType) {
      case ProductsFilterType.BrandId:
        const brandIds = checked
          ? [...(filterBrand || []), value]
          : filterBrand?.filter((item) => item !== value);

        setFilterBrand(brandIds);
        setFilter({ ...filter, BrandId: brandIds });

        break;
      case ProductsFilterType.OriginId:
        const originIds = checked
          ? [...(filterOrigin || []), value]
          : filterOrigin?.filter((item) => item !== value);

        setFilterOrigin(originIds);
        setFilter({ ...filter, OriginId: originIds });

        break;
      case ProductsFilterType.CategoryId:
        const categoryIds = checked
          ? [...(filterCategoty || []), value]
          : filterCategoty?.filter((item) => item !== value);

        setFilterCategoty(categoryIds);
        setFilter({ ...filter, CategoryId: categoryIds });

        break;

      default:
        break;
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChange(false);
    setSearchTerm(event.target.value);
    const updatedFilter = {
      ...filter,
      name: event.target.value,
    };
    setFilter(updatedFilter);
  };

  const handleAutocompleteChange = (
    _event: React.ChangeEvent<{}>,
    value: string | null
  ) => {
    setIsCheckboxChange(false);
    if (value !== null) {
      setSearchTerm(value);
      const updatedFilter = {
        ...filter,
        name: value,
      };
      setFilter(updatedFilter);
    } else {
      setSearchTerm("");
      const updatedFilter = {
        ...filter,
        name: null,
      };
      setFilter(updatedFilter);
    }
  };

  useEffect(() => {
    if (isReset) {
      setFilterBrand(filter[ProductsFilterType.BrandId]);
      setFilterCategoty(filter[ProductsFilterType.CategoryId]);
      setFilterOrigin(filter[ProductsFilterType.OriginId]);
      setIsReset(false);
    }
  }, [isReset]);

  return (
    <Box>
      <Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={productListName}
          value={filter.name || null}
          onChange={handleAutocompleteChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tìm kiếm"
              sx={{ width: "100%" }}
              onChange={handleSearchChange}
            />
          )}
        />
      </Box>
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
              {productListOriginName?.map((origin: any) => (
                <FormControlLabel
                  key={`${origin?.id}`}
                  control={
                    <Checkbox
                      checked={!!filterOrigin?.includes(origin.id)}
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
              {productListCategoryName?.map((category: any) => (
                <FormControlLabel
                  key={`${category?.id}`}
                  control={
                    <Checkbox
                      checked={!!filterCategoty?.includes(category.id)}
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
              {productListBrandName?.map((brand: any) => (
                <FormControlLabel
                  key={`${brand?.id}`}
                  control={
                    <Checkbox
                      checked={!!filterBrand?.includes(brand.id)}
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
    </Box>
  );
};

export default ProductFilteredRow;
