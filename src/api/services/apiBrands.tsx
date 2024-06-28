import { AxiosResponse } from "axios";
import { axiosPublic } from "../axiosInstance";
import {
  GET_BRAND,
} from "../pathApiName";
import { useState } from "react";

export const BrandApi = () => {
  const [loading, setLoading] = useState(false);

  const getBrandName = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(GET_BRAND);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  return {
    loading,
    getBrandName,
  };
};
