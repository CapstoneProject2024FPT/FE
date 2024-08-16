import { axiosPublic } from "../axiosInstance";
import { USER_TRANSACTION } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import config from "../../configs";

export const ApiTransaction = () => {
  const [loading, setLoading] = useState(false);

  interface transactionProps {
    AccountId: string;
  }
  const apiUserTransaction = async (params: transactionProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(USER_TRANSACTION, { params });
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
    loading,
    apiUserTransaction,
  };
};
