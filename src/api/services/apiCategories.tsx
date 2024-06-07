import { AxiosResponse } from "axios";
import { axiosPublic } from "../axiosInstance";
import { DELETE_CATEGORY, GET_CATEGORY } from "../pathApiName";
import { CategoryReponse } from "../../models/category";
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

  const deleteCategory = async (id: string) => {
    try {
      console.log(id);

      setLoading(true);
      const response = await axiosPublic.delete(
        DELETE_CATEGORY.replace(":id", id)
      );

      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  return { getCategory, loading, deleteCategory };
};
