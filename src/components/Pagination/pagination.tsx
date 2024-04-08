import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PaginationInterface {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  sibling?: number;
}

const PaginationUser: React.FC<PaginationInterface> = ({
  totalPosts,
  postsPerPage,
  currentPage,
  onPageChange,
  sibling,
}) => {
  const pageCount = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <Stack spacing={2}>
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
        size="small"
        siblingCount={sibling}
      />
    </Stack>
  );
};

export default PaginationUser;
