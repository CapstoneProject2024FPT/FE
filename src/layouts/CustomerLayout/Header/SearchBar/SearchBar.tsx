import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { colors } from "../../../../styles/Color/color";
import "../../index.css";
import "./SearchBar.scss";

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Search for:", search);
    }
  };

  return (
    <div className="search">
      <div className="search__input">
        <div className="search__icon-left">
          <FiSearch stroke={colors.gray_500} />
        </div>

        <input
          type="text"
          className="search__field"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
