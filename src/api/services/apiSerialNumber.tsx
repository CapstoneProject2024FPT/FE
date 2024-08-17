import { axiosPublic } from "../axiosInstance";
import { SERIALNUMBER, SERIALNUMBER_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import config from "../../configs";

export const ApiSerial = () => {
  const [loading, setLoading] = useState(false);

  interface SerialProps {
    MachineryId: string;
    Status: string;
  }
  const apiGetSerialbyMachineId = async (params: SerialProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(SERIALNUMBER, { params });
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

  interface addProps {
    machineryId: string;
  }
  interface quantitySerial {
    quantity: number;
  }
  const apiAddSerialbyMachineId = async (
    requestBody: addProps,
    paramsQuantity: quantitySerial
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(SERIALNUMBER, requestBody, {
        params: paramsQuantity,
      });
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

  interface UpdateProps {
    status: string;
    type: string;
  }
  const apiDeleteSerialbyMachineId = async (
    id: string,
    params: UpdateProps
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        SERIALNUMBER_ID.replace(":id", id),
        params
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

  interface addPropsSerial {
    machineComponentsId?: string;
  }
  interface quantitySerialComponent {
    quantity: number;
  }
  const apiAddSerialbyComponentId = async (
    requestBody: addPropsSerial,
    paramsQuantity: quantitySerialComponent
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(SERIALNUMBER, requestBody, {
        params: paramsQuantity,
      });
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

  interface MachineComponentProps {
    MachineComponentsId: string;
    Status: string;
  }
  const apiGetSerialbyMachineComponentId = async (
    params: MachineComponentProps
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(SERIALNUMBER, { params });
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

  const apiGetByMasterCategoryId = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        SERIALNUMBER_ID.replace(":id", id)
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
    apiGetSerialbyMachineId,
    loading,
    apiAddSerialbyMachineId,
    apiDeleteSerialbyMachineId,
    apiAddSerialbyComponentId,
    apiGetSerialbyMachineComponentId,
    apiGetByMasterCategoryId,
  };
};
