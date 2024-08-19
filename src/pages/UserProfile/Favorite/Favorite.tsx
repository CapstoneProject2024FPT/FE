/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Typography, Stack, Card, Box, IconButton } from "@mui/material";
import { FavoriteListProps, FavoriteMachine } from "../../../models/favourite";
import { toast } from "react-toastify";
import { ApiFavourite } from "../../../api/services/apiFavourite";
import Image from "../../../components/Image";
import config from "../../../configs";
import { Link } from "react-router-dom";
import { ThumbUpRounded } from "@mui/icons-material";
import CustomPagination from "../../../components/pagination/CustomPagination";
import RemoveFavorite from "./Modal/RemoveFavorite";

const Favorite: React.FC = () => {
  const [favouriteList, setFavouriteList] = useState<FavoriteListProps>();
  const { apiGetFavourite } = ApiFavourite();
  const rowPerPage = 3;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectData, setSelectData] = useState<FavoriteMachine>();
  const [open, setOpen] = useState<boolean>(false);

  const buttonStyle = {
    fontSize: "24px",
    cursor: "pointer",
    transition: "color 0.3s",
    border: "none",
    background: "none",
    outline: "none",
    color: "blue",
  };

  //favurite

  const handleRemoveFavorite = async (record: FavoriteMachine) => {
    setOpen(!open);
    setSelectData(record);
  };

  const GetFavourite = async () => {
    const response = await apiGetFavourite();
    if (response.status === 200) {
      setFavouriteList(response.data);
    }
  };

  useEffect(() => {
    GetFavourite();
  }, []);

  //paginate
  const lastIndex = rowPerPage * currentPage;
  const firstIndex = lastIndex - rowPerPage;
  const dataAtPage = favouriteList?.machinery?.slice(firstIndex, lastIndex);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  //modal
  const handleClose = () => {
    setOpen(!open);
  };

  const onSuccess = () => {
    toast.success(config.MessageNotice.FavouriteSucces);
    handleClose();
    GetFavourite();
  };
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Typography variant="h4">Danh sách yêu thích</Typography>
        <Stack
          display="flex"
          flexDirection="row"
          sx={{ justifyContent: "flex-end" }}
        ></Stack>
        <Box maxHeight={600} sx={{ overflow: "auto", mt: 2 }}>
          {dataAtPage?.map((machine) => (
            <Card
              key={machine.id}
              sx={{
                p: 1,
                mb: 3,
                position: "relative",
                boxShadow: 2,
                minWidth: "400px",
                overflow: "auto",
              }}
              variant="outlined"
            >
              <Stack
                spacing={3}
                sx={{
                  mb: 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Stack sx={{ display: "flex", flexDirection: "row" }}>
                  <Image
                    alt={machine.name}
                    src={machine.image[0].imageURL}
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: 1.5,
                    }}
                  />
                  <Stack spacing={0.5} sx={{ mt: 2, ml: 2 }}>
                    <Link
                      to={config.routes.productDetail.replace(
                        ":id",
                        machine.id
                      )}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Typography
                        noWrap
                        variant="h6"
                        sx={{
                          color: "black",
                        }}
                      >
                        {machine.name}
                      </Typography>
                    </Link>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="body2">
                        <Box component="span" sx={{ color: "text.secondary" }}>
                          {machine.model}
                        </Box>
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack spacing={0.5} display="flex" alignItems="flex-end">
                  <Box>
                    <IconButton
                      onClick={() => {
                        handleRemoveFavorite(machine);
                      }}
                      aria-label="favourite"
                    >
                      <ThumbUpRounded style={buttonStyle} />
                    </IconButton>
                  </Box>
                </Stack>
              </Stack>
            </Card>
          ))}
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handleChangePage}
            postsPerPage={rowPerPage}
            totalPosts={favouriteList?.machinery?.length ?? 0}
          />
        </Box>
      </Card>
      {open && (
        <RemoveFavorite
          favoriteList={selectData}
          onClose={handleClose}
          onSuccess={onSuccess}
          open={open}
        />
      )}
    </>
  );
};

export default Favorite;
