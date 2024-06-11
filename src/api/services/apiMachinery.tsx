import { axiosPrivate, axiosPublic } from "../axiosInstance";
import {
  ADD_MACHINERY,
  GET_MACHINERY,
  MACHINERY_ID,
  MACHINERY_LIST,
} from "../pathApiName";
import { useState } from "react";
import { CreateProductFormADDSchema } from "../../models/products";

interface GetListProps {
  name?: string;
  origin?: string;
  model?: string;
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
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const apiAddMachinery = async (params: CreateProductFormADDSchema) => {
    setLoading(true);
    try {
      console.log(params);

      const response = await axiosPublic.post(ADD_MACHINERY, params);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const apiDeleteProduct = async (id: string) => {
    setLoading(true);
    console.log(id);

    try {
      const response = await axiosPublic.delete(
        MACHINERY_ID.replace(":id", id)
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };
  const apiGetProduct = async (query: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        `${MACHINERY_LIST}?Status=${query}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  interface priorityProps {
    priority: number;
  }

  const apiUpdatePriorityProduct = async (id: string, param: priorityProps) => {
    setLoading(true);
    console.log(id);
    console.log(param);

    try {
      const response = await axiosPublic.put(
        MACHINERY_ID.replace(":id", id),
        param
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    apiGetList,
    loading,
    apiAddMachinery,
    apiGetProduct,
    apiDeleteProduct,
    apiUpdatePriorityProduct,
  };
};
