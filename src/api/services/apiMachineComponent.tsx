import { axiosPublic } from "../axiosInstance";
import { MACHINERY_COMPONENT, MACHINERY_COMPONENT_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import {
  machineComponentProps,
  UpdateProductComponent,
} from "../../models/machineComponent";

export const MachineryComponentApi = () => {
  const [loading, setLoading] = useState(false);
  const apiGetListComponent = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(MACHINERY_COMPONENT);
      return response;
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

  const apiAddMachineryComponent = async (params: machineComponentProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(MACHINERY_COMPONENT, params);
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

  const apiGetMachineryComponentDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        MACHINERY_COMPONENT_ID.replace(":id", id)
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

  const apiDeleteMachineryComponent = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.delete(
        MACHINERY_COMPONENT_ID.replace(":id", id)
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

  const apiUpdateMachineryComponent = async (
    id: string,
    params: UpdateProductComponent
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        MACHINERY_COMPONENT_ID.replace(":id", id),
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
  return {
    loading,
    apiGetListComponent,
    apiAddMachineryComponent,
    apiGetMachineryComponentDetail,
    apiDeleteMachineryComponent,
    apiUpdateMachineryComponent,
  };
};
