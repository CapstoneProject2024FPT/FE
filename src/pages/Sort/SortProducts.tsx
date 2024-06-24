import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";

const SortMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const sortTypes = ["A -> Z", "Z -> A", "Giá tăng dần", "Giá giảm dần"];
  const [selectedSort, setSelectedSort] = useState(`Sắp xếp: ${sortTypes[0]}`);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (sortOption: string) => {
    setSelectedSort(`Sắp xếp: ${sortOption}`);
    handleClose();
  };

  return (
    <Box sx={{width: "100%"}}>
      <Button aria-controls="sort-menu" aria-haspopup="true" onClick={handleClick} sx={{width: "100%"}}>
        {selectedSort}
      </Button>
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ width: '300px' }}
      >
        {sortTypes.map((sortType) => (
          <MenuItem key={sortType} onClick={() => handleMenuItemClick(sortType)}>
            {sortType}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SortMenu;
