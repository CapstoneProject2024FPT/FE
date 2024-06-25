import { axiosPrivate, axiosPublic } from "../axiosInstance";
import {
  ADD_MACHINERY,
  GET_MACHINERY,
  MACHINERY_DETAIL,
  MACHINERY_DETAIL_ID,
  MACHINERY_HOME_PRIORITY,
  MACHINERY_ID,
  MACHINERY_LIST,
} from "../pathApiName";
import { useState } from "react";
import {
  CreateProductFormADDSchema,
  UpdateProduct,
} from "../../models/products";
import axios from "axios";

interface GetListProps {
  name?: string[];
  origin?: string[];
  model?: string[];
  brand?: string[];
  description?: string;
  status?: string;
  serialNumber?: string;
  sellingPrice?: number;
  priority?: number;
  categoryId?: string;
}

export const MachineryApi = () => {
  const [loading, setLoading] = useState(false);
  const apiGetList = async (params: GetListProps) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(GET_MACHINERY, {
        params,
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      });
      return response.data;
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiAddMachinery = async (params: CreateProductFormADDSchema) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(ADD_MACHINERY, params);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiDeleteMachine = async (id: string) => {
    setLoading(true);

    try {
      const response = await axiosPublic.delete(
        MACHINERY_ID.replace(":id", id)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };
  const apiGetMachine = async (query: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        `${MACHINERY_LIST}?Status=${query}`
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  interface priorityProps {
    priority: number;
  }

  const apiUpdatePriorityMachine = async (id: string, param: priorityProps) => {
    setLoading(true);
    console.log(id);
    console.log(param);
    try {
      const response = await axiosPublic.put(
        MACHINERY_ID.replace(":id", id),
        param
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiGetMachineryID = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(`${MACHINERY_DETAIL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const apiGetDetailMachine = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        MACHINERY_DETAIL_ID.replace(":id", id)
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiUpdateMachineryDetail = async (
    id: string,
    params: UpdateProduct
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        MACHINERY_ID.replace(":id", id),
        params
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, message: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiGetMachineryPriority = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(MACHINERY_HOME_PRIORITY);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return {
          statusCode: 500,
          message: "Gặp vấn đề quá trình lấy dư liệu",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    apiGetList,
    apiAddMachinery,
    apiGetMachine,
    apiDeleteMachine,
    apiUpdatePriorityMachine,
    apiGetDetailMachine,
    apiUpdateMachineryDetail,
    apiGetMachineryID,
    apiGetMachineryPriority,
  };
};
