import { axiosPublic } from "../axiosInstance";
import { DICCOUNT, DICCOUNT_ID } from "../pathApiName";
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
      const response = await axiosPublic.get(DICCOUNT);
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
      const response = await axiosPublic.post(DICCOUNT, params);
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
      const response = await axiosPublic.delete(DICCOUNT_ID.replace(":id", id));
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

  return { apiGetDiscount, loading, apiAddDiscount, apiCloseDiscount };
};
