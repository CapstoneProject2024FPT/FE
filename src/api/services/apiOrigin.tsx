import { axiosPublic } from "../axiosInstance";
import { ORIGIN } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

export const ApiOrigin = () => {
  const [loading, setLoading] = useState(false);

  const apiGetOrigin = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(ORIGIN);

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

  return { apiGetOrigin, loading };
};
