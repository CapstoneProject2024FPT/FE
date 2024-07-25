import React, { KeyboardEvent, useState, useRef } from "react";
import { Box, InputBase } from "@mui/material";
import { KeyboardAlt, Search } from "@mui/icons-material";
import { MachineryApi } from "../../../../api/services/apiMachinery";
import { LoadingButton } from "@mui/lab";
import { useFilterContext } from "../../../../context/FilterContext";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState("");
  const { apiGetList } = MachineryApi(); // assuming `loading` isn't used directly
  const { setData } = useFilterContext();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null); // Reference for InputBase

  const handleSearch = async (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    if (event.key === "Enter") {
      await performSearch();
    }
  };

  const performSearch = async () => {
    await apiGetList({ Name: [search] });
    const query = search ? `?Name=${search}` : "";
    const targetPath = `/product-list${query}`;
    if (location.pathname === targetPath) {
      window.location.href = targetPath;
    } else {
      navigate(targetPath);
    }
    console.log("name: ", { Name: [search] });
    setData({ Name: [search] });
  };

  const handleKeyboardAltClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchButtonClick = () => {
    performSearch();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <InputBase
        placeholder="Nhập tên sản phẩm bạn muốn tìm..."
        endAdornment={
          <LoadingButton onClick={handleKeyboardAltClick}>
            <KeyboardAlt sx={{ color: "rgba(0, 0, 0, 0.55)" }} />
          </LoadingButton>
        }
        inputRef={inputRef} // Assign the inputRef to the InputBase
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.55)",
          padding: "5px 5px 5px 20px",
          borderRadius: "50px 0 0 50px",
          width: "500px",
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
      />
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.55)",
          borderRadius: "0 50px 50px 0",
          padding: "5px",
        }}
      >
        <LoadingButton onClick={handleSearchButtonClick}>
          <Search sx={{ color: "rgba(0, 0, 0, 0.55)" }} />
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SearchBar;
