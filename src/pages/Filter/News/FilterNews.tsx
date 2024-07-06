/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";

import "./FilterNews.scss";
import { NEWS_FILTER, NEWS_TYPE } from "../../../constants/filter";
import { useNavigate } from "react-router-dom";
import { ApiNewsCategories } from "../../../api/services/apiNewsCategories";
import { ApiNews } from "../../../api/services/apiNews";
import { PostGetProps } from "../../../models/blog";

interface NewFilterProps {
  setListNews?: React.Dispatch<React.SetStateAction<PostGetProps[]>>;
}

interface ProductFilter {
  [key: string]: string[];
}

const NewsFilteredRow: React.FC<NewFilterProps> = ({ setListNews }) => {
  const { getNewsCategories } = ApiNewsCategories();
  const { apiGetList } = ApiNews();
  const [filter, setFilter] = useState<any>({});
  const [newsListCategory, setNewListCategory] = useState<string[]>([]);
  const [selectedNewsTypes, setSelectedNewsTypes] = useState<string[]>([]);
  const [newsType, setNewsType] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchNewsCategory = async () => {
    const response = await getNewsCategories();
    const newsCategory = response?.map((newsCategory: any) => ({
      id: newsCategory.id,
      name: newsCategory.name,
    }));
    setNewListCategory(newsCategory);
  };

  const fetchNewsType = () => {
    const newsTypeValues = Object.values(NEWS_TYPE);
    setNewsType(newsTypeValues);
  };

  const handleFilterNews = (
    filterType: NEWS_FILTER,
    value: string,
    checked: boolean
  ) => {
    let updatedTypes: string[];
    if (checked) {
      updatedTypes = [...selectedNewsTypes, value];
    } else {
      updatedTypes = selectedNewsTypes.filter((type) => type !== value);
    }
    setSelectedNewsTypes(updatedTypes);
    const updatedFilter = {
      ...filter,
      [filterType]: updatedTypes,
    };
    setFilter(updatedFilter);
    updateURLSearchParams(updatedFilter);
    getNewsFilteredData(updatedFilter);
  };

  const updateURLSearchParams = (filter: any) => {
    const params = new URLSearchParams();
    for (const key in filter) {
      if (filter[key].length > 0) {
        params.set(key, filter[key].join(","));
      }
    }
    const to = { pathname: location.pathname, search: params.toString() };
    navigate(to, { replace: true });
  };

  const getNewsFilteredData = async (params: any) => {
    try {
      const data = await apiGetList(params);
      setListNews && setListNews(data);
    } catch (error) {
      console.error("lỗi");
    }
  };

  const getFilterFromURL = (): ProductFilter => {
    const params = new URLSearchParams(window.location.search);
    const newFilter: ProductFilter = {};
    params.forEach((value, key) => {
      newFilter[key] = value.split(",");
    });
    return newFilter;
  };

  useEffect(() => {
    const initialFilter = getFilterFromURL();
    setFilter(initialFilter);
    fetchNewsCategory();
    fetchNewsType();
  }, []);

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
      {/* showNewsTypeFilter */}
      <Box>
        <FormLabel
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "black !important",
          }}
        >
          Loại tin tức
        </FormLabel>
        <Box
          sx={{
            maxHeight: "200px",
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
            {newsType.map((type: any) => (
              <FormControlLabel
                key={`${type}`}
                control={
                  <Checkbox
                    defaultChecked={filter[NEWS_FILTER.NewsType]?.includes(type)}
                    onChange={(checked) =>
                      handleFilterNews(
                        NEWS_FILTER.NewsType,
                        type,
                        checked.target.checked
                      )
                    }
                    name={`${type}`}
                  />
                }
                label={`${type}`}
                style={{ fontSize: "10px" }}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>

      {/* showNewsCategoryFilter */}
      <Box>
        <FormLabel
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "black !important",
          }}
        >
          Loại tin tức
        </FormLabel>
        <Box
          sx={{
            maxHeight: "200px",
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
            {newsListCategory.map((newsCategory: any) => (
              <FormControlLabel
                key={`${newsCategory?.id}`}
                control={
                  <Checkbox
                    defaultChecked={filter[
                      NEWS_FILTER.NewsCategoryId
                    ]?.includes(newsCategory.id)}
                    onChange={(checked) =>
                      handleFilterNews(
                        NEWS_FILTER.NewsCategoryId,
                        newsCategory.id,
                        checked.target.checked
                      )
                    }
                    name={`${newsCategory?.name}`}
                  />
                }
                label={`${newsCategory?.name}`}
                style={{ fontSize: "10px" }}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
    </FormControl>
  );
};

export default NewsFilteredRow;
