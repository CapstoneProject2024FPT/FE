import { axiosPrivate } from "../axiosInstance";
import { FAVOURITE, FAVOURITE_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

import config from "../../configs";

export const ApiFavourite = () => {
  const [loading, setLoading] = useState(false);

  interface FavoriteProps {
    machineryId: string;
  }
  const apiAddFavourite = async (params: FavoriteProps) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post(FAVOURITE, params);

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

  const apiGetFavourite = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(FAVOURITE);

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

  const apiDeleteFavourite = async (id: string) => {
    console.log(id);

    setLoading(true);
    try {
      const response = await axiosPrivate.delete(
        FAVOURITE_ID.replace(":id", id)
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
  return { loading, apiAddFavourite, apiDeleteFavourite, apiGetFavourite };
};
