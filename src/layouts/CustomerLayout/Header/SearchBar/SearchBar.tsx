/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { colors } from "../../../../styles/Color/color";
import "./SearchBar.scss";
import {
  Autocomplete,
  Box,
  InputAdornment,
  InputBase,
  TextField,
} from "@mui/material";
import top100Films from "../../../../constants/top100Films.json";
import { Search } from "@mui/icons-material";

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.key === "Enter") {
      console.log("Search for:", search);
    }
  };

  return (
    // <div className="search">
    //   <div className="search__input">
    //     <div className="search__icon-left">
    //       <FiSearch stroke={colors.gray_500} />
    //     </div>

    <Autocomplete
      id="country-select-demo"
      sx={{
        width: 300,
        ".MuiInputBase-root": {
          marginTop: "4px",
        },
      }}
      options={top100Films}
      autoHighlight
      value={search}
      onChange={(event: any, item: any) => {
        setSearch(item.label);
      }}
      renderInput={(params) => {
        const { ...rest } = params;
        return (
          <InputBase
            {...params.InputProps}
            {...rest}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
            sx={{
              border: "1px solid",
              padding: "5px",
              borderRadius: "7px",
            }}
          />
        );
      }}

      // renderInput={(params) => <InputBase {...params} />}
      // renderInput={(params) => (
      //   <TextField
      //     {...params}
      //     label="Movie"
      //     variant="outlined"
      //     InputProps={{
      //       ...params.InputProps,
      //       startAdornment: (
      //         <InputAdornment position="start">
      //           <Search />
      //         </InputAdornment>
      //       ),
      //     }}
      //     sx={{
      //       "& legend": { display: "none" },
      //       "& .MuiInputLabel-shrink": {
      //         opacity: 0,
      //         transition: "all 0.2s ease-in",
      //       },
      //     }}
      //   />
      // )}
      // getOptionLabel={(option) => option}
      // renderOption={(props, item) => item}
    />

    // <input
    //   type="text"
    //   className="search__field"
    //   placeholder="Tìm kiếm"
    //   value={search}
    //   onChange={(e) => setSearch(e.target.value)}
    //   onKeyDown={handleSearch}
    // />
    //   </div>
    // </div>
  );
};

export default SearchBar;
