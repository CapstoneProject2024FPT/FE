import { axiosPublic } from "../axiosInstance";
import { DISCOUNT, DISCOUNT_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import config from "../../configs";

export const ApiDiscount = () => {
  const [loading, setLoading] = useState(false);

  interface DiscountProps {
    name: string;
    type: string;
    value: number;
  }

  const apiGetDiscount = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(DISCOUNT);

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

  const apiAddDiscount = async (params: DiscountProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(DISCOUNT, params);

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

  const apiCloseDiscount = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.delete(DISCOUNT_ID.replace(":id", id));

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

  interface DiscountUpdateProps {
    name?: string;
    type?: string;
    status?: string;
    value?: number;
  }
  const apiOpenDiscount = async (id: string, params: DiscountUpdateProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        DISCOUNT_ID.replace(":id", id),
        params
      );

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

  const apiUpdateDiscount = async (id: string, params: DiscountUpdateProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        DISCOUNT_ID.replace(":id", id),
        params
      );

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
  return {
    apiGetDiscount,
    loading,
    apiAddDiscount,
    apiCloseDiscount,
    apiOpenDiscount,
    apiUpdateDiscount,
  };
};
