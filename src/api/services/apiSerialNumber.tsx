import { axiosPublic } from "../axiosInstance";
import { SERIALNUMBER, SERIALNUMBER_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

export const ApiSerial = () => {
  const [loading, setLoading] = useState(false);

  const apiGetSerialbyMachineId = async (query: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(
        `${SERIALNUMBER}?MachineryId=${query}`
      );

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

  interface addProps {
    machineryId: string;
  }
  const apiAddSerialbyMachineId = async (params: addProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(SERIALNUMBER, params);

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
        return { statusCode: 500, Error: "Internal Server Error" };
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
  };
};
