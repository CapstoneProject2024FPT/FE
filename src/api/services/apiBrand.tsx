/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { brandProps, brandUpdateProps } from "../../models/brand";
import { axiosPublic } from "../axiosInstance";
import { BRAND, BRAND_ID, GET_BRAND } from "../pathApiName";
import { useState } from "react";
import config from "../../configs";

export const BrandApi = () => {
  const [loading, setLoading] = useState(false);

  interface BrandProps {
    status?: string;
  }
  const getBrand = async (params: BrandProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(BRAND, { params });

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

  const deleteBrand = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosPublic.delete(BRAND_ID.replace(":id", id));

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

  const updateActiveBrand = async (id: string, params: BrandProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.put(
        BRAND_ID.replace(":id", id),
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

  const addBrand = async (params: brandProps) => {
    try {
      console.log(params);

      setLoading(true);
      const response = await axiosPublic.post(BRAND, params);
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

  const updateBrand = async (id: string, params: brandUpdateProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.put(
        BRAND_ID.replace(":id", id),
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

  const getBrandName = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(GET_BRAND);
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
    getBrand,
    loading,
    deleteBrand,
    addBrand,
    updateBrand,
    getBrandName,
    updateActiveBrand,
  };
};
