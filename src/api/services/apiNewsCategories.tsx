/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { axiosPublic } from "../axiosInstance";
import { NEWS_CATEGORIES, NEWS_CATEGORIES_ID } from "../pathApiName";
import { useState } from "react";
import config from "../../configs";

export const ApiNewsCategories = () => {
  const [loading, setLoading] = useState(false);

  const getNewsCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(NEWS_CATEGORIES);
      setLoading(false);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteNewsCategories = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosPublic.delete(
        NEWS_CATEGORIES_ID.replace(":id", id)
      );

      setLoading(false);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  interface NewsCategoryProps {
    name: string;
    description: string;
  }
  const addNewsCategories = async (params: NewsCategoryProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.post(NEWS_CATEGORIES, params);
      setLoading(false);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  interface NewsCategoryPropsUpdate {
    name: string;
    description: string;
    status: string;
  }
  const updateNewsCategory = async (
    id: string,
    params: NewsCategoryPropsUpdate
  ) => {
    try {
      setLoading(true);
      const response = await axiosPublic.put(
        NEWS_CATEGORIES_ID.replace(":id", id),
        params
      );
      setLoading(false);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  interface paramAvailable {
    status: string;
  }
  const getNewsCategoriesAvailable = async (params: paramAvailable) => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(NEWS_CATEGORIES, { params });

      setLoading(false);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };
  return {
    getNewsCategories,
    loading,
    deleteNewsCategories,
    addNewsCategories,
    updateNewsCategory,
    getNewsCategoriesAvailable,
  };
};
