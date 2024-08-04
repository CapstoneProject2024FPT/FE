/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
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
import { debounce } from "../../../utils/debounce";
import { useFilterContext } from "../../../context/FilterContext";

interface ProductFilterProps {
  filter: any;
  setFilter: React.Dispatch<any>;
  isReset: boolean;
  setIsReset: (value: React.SetStateAction<boolean>) => void;

  productListOriginName: string[];
  productListCategoryName: string[];
  productListBrandName: string[];
}

const ProductFilteredRow: React.FC<ProductFilterProps> = ({
  filter = {},
  setFilter,
  isReset,
  setIsReset,

  productListOriginName,
  productListCategoryName,
  productListBrandName,
}) => {
  const { setSearchBarData } = useFilterContext();
  const [filterOrigin, setFilterOrigin] = useState<string[]>(
    filter[ProductsFilterType.OriginId] || []
  );
  const [filterCategory, setFilterCategory] = useState<string[]>(
    filter[ProductsFilterType.CategoryId] || []
  );
  const [filterBrand, setFilterBrand] = useState<string[]>(
    filter[ProductsFilterType.BrandId] || []
  );

  const handleFilterProducts = useCallback(
    debounce(
      (filterType: ProductsFilterType, value: string, checked: boolean) => {
        const searchName = { ...filter, Name: undefined };
        setSearchBarData("");
        switch (filterType) {
          case ProductsFilterType.BrandId:
            // eslint-disable-next-line no-case-declarations
            const brandIds = checked
              ? [...(filterBrand || []), value]
              : filterBrand?.filter((item) => item !== value);

            setFilterBrand(brandIds);
            setFilter({ ...searchName, BrandId: brandIds });

            break;
          case ProductsFilterType.OriginId:
            // eslint-disable-next-line no-case-declarations
            const originIds = checked
              ? [...(filterOrigin || []), value]
              : filterOrigin?.filter((item) => item !== value);

            setFilterOrigin(originIds);
            setFilter({ ...searchName, OriginId: originIds });

            break;
          case ProductsFilterType.CategoryId:
            // eslint-disable-next-line no-case-declarations
            const categoryIds = checked
              ? [...(filterCategory || []), value]
              : filterCategory?.filter((item) => item !== value);

            setFilterCategory(categoryIds);
            setFilter({ ...searchName, CategoryId: categoryIds });

            break;

          default:
            break;
        }
      },
      300
    ), // Set the debounce delay (300ms in this case)
    [filter, filterBrand, filterCategory, filterOrigin, setFilter]
  );

  //fix chỗ này dùng useLocation đê trigger lại useEffect
  useEffect(() => {
    if (isReset) {
      setFilterBrand(filter[ProductsFilterType.BrandId]);
      setFilterCategory(filter[ProductsFilterType.CategoryId]);
      setFilterOrigin(filter[ProductsFilterType.OriginId]);
      setIsReset(false);
    }
  }, [isReset, filter, setIsReset]);

  return (
    <Box>
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
              fontSize: "18px",
              fontWeight: "bold",
              color: "black !important",
            }}
          >
            Xuất xứ
          </FormLabel>
          <FormGroup
            sx={{
              paddingLeft: "8px",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              maxHeight: "260px",
              marginTop: "8px",
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
            {productListOriginName?.map((origin: any) => (
              <FormControlLabel
                key={`${origin?.id}`}
                control={
                  <Checkbox
                    sx={{
                      padding: "4px",
                    }}
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

        {/* showProductsCategoryFilter */}
        <Box>
          <FormLabel
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "black !important",
            }}
          >
            Loại máy
          </FormLabel>
          <FormGroup
            sx={{
              paddingLeft: "8px",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              maxHeight: "260px",
              marginTop: "8px",
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
            {productListCategoryName?.map((category: any) => (
              <FormControlLabel
                key={`${category?.id}`}
                control={
                  <Checkbox
                    sx={{
                      padding: "4px",
                    }}
                    checked={!!filterCategory?.includes(category.id)}
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

        {/* showProductsBrandFilter */}
        <Box>
          <FormLabel
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "black !important",
            }}
          >
            Thương hiệu
          </FormLabel>

          <FormGroup
            sx={{
              paddingLeft: "8px",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              maxHeight: "260px",
              marginTop: "8px",
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
            {productListBrandName?.map((brand: any) => (
              <FormControlLabel
                key={`${brand?.id}`}
                control={
                  <Checkbox
                    sx={{
                      padding: "4px",
                    }}
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
          {/* </Box> */}
        </Box>
      </FormControl>
    </Box>
  );
};

export default ProductFilteredRow;
