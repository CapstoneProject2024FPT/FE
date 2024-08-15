import { axiosPrivate } from "../axiosInstance";
import { CHECKOUT, PAYMENTS, PAYMENTS_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { CheckOutProp } from "../../models/checkout";
import { paymentProps } from "../../models/payment";
import config from "../../configs";

export const ApiCheckout = () => {
  const [loading, setLoading] = useState(false);

  const apiCheckout = async (params: CheckOutProp) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post(CHECKOUT, params);
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

  const apiPayment = async (params: paymentProps) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post(PAYMENTS, params);
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

  interface paymentUpdate {
    status: string;
  }
  const apiPaymentUpdate = async (params: paymentUpdate, id: string) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.put(
        PAYMENTS_ID.replace(":id", id),
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
  return { apiCheckout, loading, apiPayment, apiPaymentUpdate };
};
