import { brandProps, brandUpdateProps } from "../../models/brand";
import { axiosPublic } from "../axiosInstance";
import { BRAND, BRAND_ID, GET_BRAND } from "../pathApiName";
import { useState } from "react";

export const BrandApi = () => {
  const [loading, setLoading] = useState(false);

  const getBrand = async () => {
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

  const deleteBrand = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosPublic.delete(BRAND_ID.replace(":id", id));

      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  const addBrand = async (params: brandProps) => {
    try {
      console.log(params);

      setLoading(true);
      const response = await axiosPublic.post(BRAND, params);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw new Error("Login failed");
    }
  };

  const updateBrand = async (id: string, params: brandUpdateProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.put(
        BRAND_ID.replace(":id", id),
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
    getBrand,
    loading,
    deleteBrand,
    addBrand,
    updateBrand,
  };
};
