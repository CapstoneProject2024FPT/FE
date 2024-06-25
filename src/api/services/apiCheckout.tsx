import { axiosPublic } from "../axiosInstance";
import { CHECKOUT } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { CheckOutProp } from "../../models/checkout";

export const ApiCheckout = () => {
  const [loading, setLoading] = useState(false);

  const apiCheckout = async (params: CheckOutProp) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(CHECKOUT, params);

      return response;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Internal Server Error" };
      }
    } finally {
      setLoading(false);
    }
  };

  return { apiCheckout, loading };
};
