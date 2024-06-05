import { AxiosResponse } from "axios";
import { axiosPublic } from "../axiosInstance";
import { GET_CATEGORY } from "../pathApiName";
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
      throw new Error("Login failed");
    }
  };

  return { getCategory, loading };
};
