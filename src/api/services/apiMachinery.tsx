import { axiosPublic } from "../axiosInstance";
import {
  ADD_MACHINERY,
  ADD_MACHINERY_COMPONENT,
  GET_MACHINERY,
  MACHINERY,
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
  Name?: string[]; // mấy hôm trước nhớ sài name thường mà nay nó báo lỗi.. check lại
}

export const MachineryApi = () => {
  const [loading, setLoading] = useState(false);
  const apiGetList = async (params: GetListProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(GET_MACHINERY, {
        params,
        paramsSerializer: {
          indexes: null, // no brackets at all
        },
      });
      console.log(response.data.items)
      return {
        items: response.data.items,
        total: response.data.total, // Ensure the total count is returned
      };
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
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
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
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
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
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
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  interface priorityProps {
    originId: string;
    status: string;
    priority: number;
    brandId: string;
    categoryId: string;
  }

  const apiUpdatePriorityMachine = async (id: string, param: priorityProps) => {
    setLoading(true);
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
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  const apiGetMachineryID = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(MACHINERY_ID.replace(":id", id));
      return response;
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
      const response = await axiosPublic.get(MACHINERY_ID.replace(":id", id));
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
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
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
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
          Error: "Gặp vấn đề quá trình lấy dư liệu",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  interface machineAtHome {
    status: string;
    size: number;
  }
  const apiGetMachineAtHome = async (params: machineAtHome) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(MACHINERY, { params });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
      }
    } finally {
      setLoading(false);
    }
  };

  type postComponentMachine = string[];

  const apiPostMachineComponent = async (
    requestParams: postComponentMachine,
    id: string
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(
        ADD_MACHINERY_COMPONENT.replace(":id", id),
        requestParams
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: "Gặp vấn đề quá trình lấy dư liệu" };
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
    apiGetMachineAtHome,
    apiPostMachineComponent,
  };
};
