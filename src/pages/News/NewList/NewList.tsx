import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./NewList.scss";
import { Box, Button, Chip, Drawer, Typography } from "@mui/material";
import { GridFilterListIcon } from "@mui/x-data-grid";
import { Skeleton } from "antd";
import { ApiNews } from "../../../api/services/apiNews";
import { PostGetProps } from "../../../models/blog";
import NewsCard from "./NewsCard";
import NewsFilteredRow from "../../Filter/News/FilterNews";
import { CloseOutlined, LogoutOutlined } from "@mui/icons-material";
import { ApiNewsCategories } from "../../../api/services/apiNewsCategories";
import { NEWS_FILTER } from "../../../constants/filter";
import { useLocation, useNavigate } from "react-router-dom";

const ListNews: React.FC = () => {
  const [listNews, setListNews] = useState<PostGetProps[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const { apiGetList, apiGetListNews } = ApiNews();
  const { getNewsCategories } = ApiNewsCategories();
  const [newsListCategory, setNewListCategory] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchListNews = async () => {
    try {
      const response = await apiGetListNews();
      const listNews = response.items;
      setListNews(listNews);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    }
  };

  const fetchNewsCategory = async () => {
    const response = await getNewsCategories();
    const newsCategory = response?.map((newsCategory: any) => ({
      id: newsCategory.id,
      name: newsCategory.name,
    }));
    setNewListCategory(newsCategory);
  };

  useEffect(() => {
    fetchListNews();
    fetchNewsCategory();
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateURLSearchParams = (filter: any) => {
    const searchParams = new URLSearchParams();
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        searchParams.set(key, filter[key]);
      } else {
        searchParams.delete(key);
      }
    });
    const to = { pathname: location.pathname, search: searchParams.toString() };
    navigate(to, { replace: true });
  };

  const getNewsFilteredData = async (params: any) => {
    try {
      const data = await apiGetList(params);
      setListNews && setListNews(data);
    } catch (error) {
      console.error("Error fetching filtered news:", error);
    }
  };

  const handleResetFilters = () => {
    const resetFilter = {};
    setFilter(resetFilter);
    updateURLSearchParams(resetFilter);
    getNewsFilteredData(resetFilter);
  };

  const handleClearFilter = (key: string, value: string) => {
    const updatedFilter = { ...filter };
    if (key === NEWS_FILTER.NewsCategoryId || key === NEWS_FILTER.NewsType) {
      updatedFilter[key] = updatedFilter[key].filter(
        (val: any) => val !== value
      );
      if (updatedFilter[key].length === 0) {
        delete updatedFilter[key];
      }
    } else if (key === "Title") {
      updatedFilter[key] = ""; // Clear the Autocomplete filter
    }
    setFilter && setFilter(updatedFilter);
    updateURLSearchParams(updatedFilter);
    getNewsFilteredData(updatedFilter);
  };

  const getNewsCategoryName = (categoryId: string, newsListCategory: any[]) => {
    const category = newsListCategory.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  const getFilterArray = (filter: { [key: string]: string[] }) => {
    const filterArray: { key: string; value: string }[] = [];
    for (const key in filter) {
      if (key !== "Title") {
        filter[key]?.forEach((value) => {
          filterArray.push({ key, value });
        });
      }
    }
    return filterArray;
  };

  const filterArray = getFilterArray(filter);

  const renderChips = () => {
    return (
      <>
        {filterArray.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "800",
                letterSpacing: "-1px",
                color: "#1976d2",
              }}
            >
              Đã chọn:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                flex: "3",
                marginLeft: "4px",
              }}
            >
              {filterArray.map(({ key, value }) => (
                <Chip
                  key={key + value}
                  label={
                    key === NEWS_FILTER.NewsCategoryId
                      ? `Loại tin: ${getNewsCategoryName(
                          value,
                          newsListCategory
                        )}`
                      : `Mức độ: ${value}`
                  }
                  onDelete={() => handleClearFilter(key, value)}
                  sx={{ margin: "5px" }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                border: "1px solid rgba(25, 118, 210, 0.5)",
                padding: "4px",
                color: "#1976d2",
                borderRadius: "5px",
                "&:hover": {
                  cursor: "pointer",
                  border: "1px solid #1976d2",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
              onClick={handleResetFilters}
            >
              <CloseOutlined />
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                }}
              >
                Xóa tất cả
              </Typography>
            </Box>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        flexDirection: "row",
        margin: "20px auto auto auto",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          borderRadius: "5px",
          width: "20%",
          minWidth: "200px",
          height: "100%",
          position: "sticky",
          top: 0,
        }}
      >
        <NewsFilteredRow
          setListNews={setListNews}
          filter={filter}
          setFilter={setFilter}
        />
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Button
          variant="outlined"
          onClick={toggleDrawer(true)}
          sx={{
            borderRadius: "5px",
            "&:hover": {
              borderColor: "#1976d2",
              borderRadius: "5px",
            },
          }}
        >
          <GridFilterListIcon
            sx={{
              "&:hover": {
                color: "#1976d2",
                backgroundColor: "unset",
                borderRadius: "none",
              },
            }}
          />
          <Typography sx={{ marginLeft: "4px" }} className="hide-text-on-small">
            Lọc
          </Typography>
        </Button>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: "250px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              borderRadius: "5px",
              height: "100%",
              overflowY: "auto",
              zIndex: 1100, // Higher z-index for Drawer
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
            <NewsFilteredRow
              setListNews={setListNews}
              filter={filter}
              setFilter={setFilter}
            />
            <Box>
              {isDrawerOpen && (
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  <Button
                    variant="outlined"
                    onClick={toggleDrawer(false)}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "5px",
                      "&:hover": {
                        borderColor: "#1976d2",
                        borderRadius: "5px",
                        backgroundColor: "white",
                      },
                    }}
                  >
                    <LogoutOutlined
                      sx={{
                        transform: "scaleX(-1)",
                        marginRight: "5px",
                        "&:hover": {
                          color: "#1976d2",
                          backgroundColor: "white",
                          borderRadius: "none",
                        },
                      }}
                    />
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Drawer>
      </Box>
      <Box sx={{ width: { xs: "100%", md: "80%" } }}>
        <Box
          sx={{
            padding: "10px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            borderRadius: "5px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <Typography
              sx={{
                textTransform: "uppercase",
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              Tin tức mới
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            minHeight: "64px",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>{renderChips()}</Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: "25px",
            justifyContent: "space-between",
            padding: "0 20px",
            gridTemplateColumns: {
              md: "1fr",
            },
          }}
        >
          {listNews?.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ListNews;
