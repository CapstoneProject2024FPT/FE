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
    if (event.keyCode === 13) {
      await apiGetList({ name: search });
    }
  };

  return (
    <InputBase
      placeholder="Search..."
      startAdornment={
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      }
      endAdornment={
        <LoadingButton
          variant="outlined"
          startIcon={<Search />}
          sx={{ textTransform: "capitalize" }}
          loading={loading}
        >
          Search
        </LoadingButton>
      }
      sx={{
        border: "1px solid",
        padding: "5px",
        borderRadius: "7px",
      }}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleSearch}
    />
  );
};

export default SearchBar;
