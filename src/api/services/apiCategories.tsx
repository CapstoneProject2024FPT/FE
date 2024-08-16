/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { axiosPublic } from "../axiosInstance";
import {
  CATEGORY,
  CATEGORY_ID,
  GET_CATEGORY,
  GET_CATEGORY_CHILD,
  GET_CATEGORY_PARENT,
} from "../pathApiName";
import { CategoryProps } from "../../models/category";
import { useState } from "react";
import config from "../../configs";

export const CategoryApi = () => {
  const [loading, setLoading] = useState(false);

  const getCategory = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(GET_CATEGORY);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  const getCategoryName = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(GET_CATEGORY_CHILD);
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

  const getCategoryParent = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(GET_CATEGORY_PARENT);
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

  const getCategoryChild = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(GET_CATEGORY_CHILD);
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
  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosPublic.delete(CATEGORY_ID.replace(":id", id));
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

  const addCategory = async (params: CategoryProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.post(CATEGORY, params);
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

  const updateCategory = async (id: string, params: CategoryProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.put(
        CATEGORY_ID.replace(":id", id),
        params
      );
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
  return {
    loading,
    getCategory,
    getCategoryName,
    deleteCategory,
    addCategory,
    updateCategory,
    getCategoryParent,
    getCategoryChild,
  };
};
