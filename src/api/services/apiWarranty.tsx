import { axiosPrivate, axiosPublic } from "../axiosInstance";
import {
  WARRANTY,
  WARRANTY_DETAIL,
  WARRANTY_DETAIL_ID,
  WARRANTY_ID,
} from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { CreateWarranty } from "../../models/warranty";
import config from "../../configs";

export const ApiWarranty = () => {
  const [loading, setLoading] = useState(false);

  interface warrantyParams {
    type?: string;
    AccountId?: string;
    InventoryId?: string;
  }
  const apiGetWarranty = async (params: warrantyParams) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(WARRANTY, { params });
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

  const apiGetWarrantyById = async (id: string) => {
    setLoading(true);

    try {
      const response = await axiosPublic.get(WARRANTY_ID.replace(":id", id));
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

  const apiGetWarrantyDetailById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        WARRANTY_DETAIL_ID.replace(":id", id)
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

  const apiCreateRequestWaranty = async (params: CreateWarranty) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post(WARRANTY, params);
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

  interface getWarrantyProps {
    Type?: string;
  }
  const apiGetWarantyManager = async (params: getWarrantyProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(WARRANTY, { params });
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

  interface getWarrantyProps {
    Type?: string;
  }
  const apiGetWarantyPeriodic = async (params: getWarrantyProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(WARRANTY_DETAIL, { params });
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

  interface CancelWarrantyProps {
    warrantyId: string;
    status: string;
    description: string;
  }

  const apiCancelWarrantyDetail = async (params: CancelWarrantyProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        `${WARRANTY_DETAIL}/${params.warrantyId}`,
        {
          status: params.status,
          description: params.description,
        }
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
    apiGetWarranty,
    apiGetWarrantyById,
    loading,
    apiCreateRequestWaranty,
    apiGetWarantyManager,
    apiGetWarantyPeriodic,
    apiGetWarrantyDetailById,
    apiCancelWarrantyDetail,
  };
};
