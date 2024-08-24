import { axiosPublic } from "../axiosInstance";
import {
  GET_MACHINERY_COMPONENT,
  GET_MACHINERY_COMPONENT_PAGINATE,
  MACHINERY_COMPONENT,
  MACHINERY_COMPONENT_ID,
} from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import {
  machineComponentProps,
  UpdateProductComponent,
} from "../../models/machineComponent";
import config from "../../configs";

export const MachineryComponentApi = () => {
  const [loading, setLoading] = useState(false);
  interface MachineComponentProps {
    CategoryId?: string;
  }
  const apiGetListComponent = async (params: MachineComponentProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(GET_MACHINERY_COMPONENT, {
        params,
      });
      return response;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  interface GetListProps {
    size: number;
    page: number;
    Name?: string;
    CreateDate?: string | null;
  }

  const apiGetListComponentPaginate = async (params: GetListProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(GET_MACHINERY_COMPONENT_PAGINATE, {
        params,
      });
      return response;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
      }
    } finally {
      setLoading(false);
    }
  };

  interface UpdateComponentQuantity {
    originId: string;
    brandId: string;
    status: string;
    categoryId: string;
    quantity: number;
  }

  const apiUpdateComponentQuantity = async (
    id: string,
    params: UpdateComponentQuantity
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
        return { statusCode: 500, Error: config.MessageNotice.Error500 };
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
    apiGetListComponentPaginate,
    apiUpdateComponentQuantity,
  };
};
