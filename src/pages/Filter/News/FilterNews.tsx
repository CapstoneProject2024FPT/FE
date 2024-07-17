/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  TextField,
  Autocomplete,
} from "@mui/material";
import "./FilterNews.scss";
import { NEWS_FILTER, NEWS_TYPE } from "../../../constants/filter";
import { useNavigate } from "react-router-dom";
import { ApiNewsCategories } from "../../../api/services/apiNewsCategories";
import { ApiNews } from "../../../api/services/apiNews";
import { PostGetProps } from "../../../models/blog";
import { debounce } from "../../../utils/debounce";

interface NewFilterProps {
  setListNews?: React.Dispatch<React.SetStateAction<PostGetProps[]>>;
  filter?: any;
  setFilter?: React.Dispatch<any>;
}

interface ProductFilter {
  [key: string]: string[];
}

const NewsFilteredRow: React.FC<NewFilterProps> = ({
  setListNews,
  filter,
  setFilter,
}) => {
  const { getNewsCategories } = ApiNewsCategories();
  const { apiGetList, apiGetListNews } = ApiNews();
  const [newsListCategory, setNewListCategory] = useState<string[]>([]);
  const [newsListTitle, setNewsListTitle] = useState<string[]>([]);
  const [newsType, setNewsType] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [isCheckboxChange, setIsCheckboxChange] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log(searchTerm, isCheckboxChange);

  const fetchNewsCategory = async () => {
    const response = await getNewsCategories();
    const newsCategory = response?.map((newsCategory: any) => ({
      id: newsCategory.id,
      name: newsCategory.name,
    }));
    setNewListCategory(newsCategory);
  };

  const fetchNewsTitle = async () => {
    const response = await apiGetListNews();
    const newsTitle = response.items.map(
      (newsTitle: { title: any }) => newsTitle.title
    );
    setNewsListTitle(newsTitle);
  };

  const fetchNewsType = () => {
    const newsTypeValues = Object.values(NEWS_TYPE);
    setNewsType(newsTypeValues);
  };

  const handleAutocompleteChange = useCallback(
    debounce((value: string | null) => {
      setIsCheckboxChange(false);
      if (value !== null) {
        setSearchTerm(value);
        const updatedFilter = {
          ...filter,
          Title: value,
        };
        setFilter && setFilter(updatedFilter);
        updateURLSearchParams(updatedFilter);
        getNewsFilteredData(updatedFilter);
      } else {
        setSearchTerm("");
        const updatedFilter = {
          ...filter,
          Title: null,
        };
        setFilter && setFilter(updatedFilter);
        updateURLSearchParams(updatedFilter);
        getNewsFilteredData(updatedFilter);
      }
    }, 300),
    [filter, setFilter]
  );

  const handleFilterNews = useCallback(
    debounce((filterType: NEWS_FILTER, value: string, checked: boolean) => {
      setIsCheckboxChange(true);
      const item = filter[filterType] || [];
      if (checked) {
        filter[filterType] = [...item, value];
      } else {
        filter[filterType] = item.filter((val: any) => val !== value);
      }
      setFilter && setFilter(filter);
      updateURLSearchParams(filter);
      getNewsFilteredData(filter);
    }, 300),
    [filter, setFilter]
  );

  const updateURLSearchParams = (filter: any) => {
    const params = new URLSearchParams();
    for (const key in filter) {
      if (Array.isArray(filter[key]) && filter[key].length > 0) {
        params.set(key, filter[key].join(","));
      } else if (key === "Title" && filter[key]) {
        params.set("Title", filter[key]);
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
      console.error("Error fetching filtered news:", error);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChange(false);
    setSearchTerm(event.target.value);
    const updatedFilter = {
      ...filter,
      Title: event.target.value,
    };
    setFilter && setFilter(updatedFilter);
    updateURLSearchParams(updatedFilter);
    getNewsFilteredData(updatedFilter);
  };

  useEffect(() => {
    const initialFilter = getFilterFromURL();
    setFilter && setFilter(initialFilter);
    fetchNewsCategory();
    fetchNewsType();
    fetchNewsTitle();
  }, []);

  return (
    <Box>
      <Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={newsListTitle}
          value={filter.Title || null}
          onChange={(_event, value) => handleAutocompleteChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tìm kiếm"
              sx={{ width: "100%" }}
              onChange={handleSearchChange}
            />
          )}
        />
      </Box>
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
            Mức độ tin tức
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
                      checked={!!filter[NEWS_FILTER.NewsType]?.includes(type)}
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
                      checked={
                        !!filter[NEWS_FILTER.NewsCategoryId]?.includes(
                          newsCategory.id
                        )
                      }
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
    </Box>
  );
};

export default NewsFilteredRow;
