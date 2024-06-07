import React, { KeyboardEvent, useState } from "react";
import { InputAdornment, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import { MachineryApi } from "../../../../api/services/apiMachinery";
import { LoadingButton } from "@mui/lab";

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState("");
  const { apiGetList, loading } = MachineryApi();

  const handleSearch = async (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    if (event.key === "Enter") {
      await apiGetList({ name: search });
    }
  };

  return (
    <InputBase
      placeholder="Nhập nội dung tìm kiếm..."
      startAdornment={
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      }
      endAdornment={
        <LoadingButton
          variant="outlined"
          startIcon={<Search />}
          sx={{ textTransform: "capitalize", width: "200px" }}
          loading={loading}
        >
          Tìm Kiếm
        </LoadingButton>
      }
      sx={{
        border: "1px solid",
        padding: "5px",
        borderRadius: "7px",
        width: "500px",
      }}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleSearch}
    />
  );
};

export default SearchBar;
