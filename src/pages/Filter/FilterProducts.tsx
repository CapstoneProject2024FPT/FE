import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";

import "./FilterProducts.scss";

interface ProductFilterProps {
  listProduct: any;
}

const ProductFilteredRow: React.FC<ProductFilterProps> = ({ listProduct }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const product = event.target.name;
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(product)
        ? prevSelectedCategories.filter((c) => c !== product)
        : [...prevSelectedCategories, product]
    );
  };

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
                    checked={selectedCategories.includes(origin)}
                    onChange={handleCategoryChange}
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
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
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
                    checked={selectedCategories.includes(brand)}
                    onChange={handleCategoryChange}
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
                    checked={selectedCategories.includes(warranty)}
                    onChange={handleCategoryChange}
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
