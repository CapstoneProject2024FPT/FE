import { axiosPublic } from "../axiosInstance";
import { ORDER, ORDER_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

export const ApiOrder = () => {
  const [loading, setLoading] = useState(false);

  const apiGetOrder = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(ORDER);

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  interface GetOrderProps {
    AccountId: string;
    page: number;
    size: number;
  }
  const apiGetOrderById = async (params: GetOrderProps) => {
    setLoading(true);

    try {
      const response = await axiosPublic.get(ORDER, { params });

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  interface CancelOrderProps {
    orderId: string;
    status: string;
    note: string;
  }

  const apiCancelOrder = async (params: CancelOrderProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(`${ORDER}/${params.orderId}`, {
        status: params.status,
        note: params.note,
      });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  interface OrderProps {
    status: string;
    note: string;
  }
  const apiOrderId = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(ORDER_ID.replace(":id", id));
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiCompleteOrder = async (id: string, params: OrderProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        ORDER_ID.replace(":id", id),
        params
      );
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    apiGetOrder,
    loading,
    apiGetOrderById,
    apiCancelOrder,
    apiOrderId,
    apiCompleteOrder,
  };
};
