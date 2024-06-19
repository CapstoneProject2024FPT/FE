import { AxiosResponse } from "axios";
import { axiosPublic } from "../axiosInstance";
import {
  CATEGORY,
  CATEGORY_ID,
  GET_CATEGORY,
  GET_CATEGORY_PARENT,
} from "../pathApiName";
import { CategoryProps, CategoryReponse } from "../../models/category";
import { useState } from "react";

export const CategoryApi = () => {
  const [loading, setLoading] = useState(false);

  const getCategory = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<CategoryReponse> = await axiosPublic.get(
        GET_CATEGORY
      );

      setLoading(false);
      return response.data.items;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  const getCategoryParent = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<CategoryReponse> = await axiosPublic.get(
        GET_CATEGORY_PARENT
      );

      setLoading(false);
      return response.data.items;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };
  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosPublic.delete(CATEGORY_ID.replace(":id", id));

      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  const addCategory = async (params: CategoryProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.post(CATEGORY, params);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
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
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };
  return {
    getCategory,
    loading,
    deleteCategory,
    addCategory,
    updateCategory,
    getCategoryParent,
  };
};
