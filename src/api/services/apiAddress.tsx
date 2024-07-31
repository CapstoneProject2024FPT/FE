import { axiosPrivate, axiosPublic } from "../axiosInstance";
import { GET_ADDRESS, GET_CITY, GET_DISTRICT, GET_WARD } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { addressForm } from "../../models/address";
import config from "../../configs";

export const ApiAddress = () => {
  const [loading, setLoading] = useState(false);

  const apiGetCity = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(GET_CITY);

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  interface fetchDistrictParams {
    CityId: string;
  }
  const apiDistrict = async (params: fetchDistrictParams) => {
    try {
      const response = await axiosPublic.get(GET_DISTRICT, { params });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    }
  };

  interface fetchWardParams {
    DistrictId: string;
  }
  const apiWard = async (params: fetchWardParams) => {
    try {
      const response = await axiosPublic.get(GET_WARD, { params });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    }
  };

  interface PropsGetAddress {
    AccountId: string;
  }

  const apiGetAddress = async (params: PropsGetAddress) => {
    try {
      const response = await axiosPublic.get(GET_ADDRESS, { params });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    }
  };

  const apiCreateAddress = async (params: addressForm) => {
    try {
      const response = await axiosPrivate.post(GET_ADDRESS, params);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    }
  };
  return {
    apiGetCity,
    apiDistrict,
    loading,
    apiWard,
    apiGetAddress,
    apiCreateAddress,
  };
};
