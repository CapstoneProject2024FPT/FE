import { axiosPublic } from "../axiosInstance";
import { NEWS_ADMIN, NEWS_HOME, NEWS_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";
import { NewPostFormADDValues, NewUpdateFormValues, PostGetProps } from "../../models/blog";

export const ApiNews = () => {
  const [loading, setLoading] = useState(false);

  const apiPostNews = async (params: NewPostFormADDValues) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(NEWS_HOME, params);
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

  const apiGetNews = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(NEWS_ADMIN);
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

  const apiGetNewsDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(NEWS_ID.replace(":id", id));
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

  const apiUpdateNewsDetail = async (
    id: string,
    params: NewUpdateFormValues
  ) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        NEWS_ID.replace(":id", id),
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

  const apiDisableNews = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosPublic.delete(NEWS_ID.replace(":id", id));
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

  interface ableNewsAndType {
    type: string;
    status: string;
    newsCategoryId: string;
  }
  const apiAbleAndTypeNews = async (id: string, params: ableNewsAndType) => {
    setLoading(true);
    try {
      const response = await axiosPublic.put(
        NEWS_ID.replace(":id", id),
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

  interface newsHome {
    status: string;
  }
  const apiGetNewsHomePage = async (params: newsHome) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(NEWS_HOME, { params });
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

  
  const apiGetListNews = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(NEWS_HOME);
      return response.data;
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

  const apiGetList = async (params: PostGetProps) => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(NEWS_ADMIN, {
        params,
        paramsSerializer: {
          indexes: null,
        },
      });
      return response.data;
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

  return {
    loading,
    apiGetList,
    apiGetListNews,
    apiPostNews,
    apiGetNews,
    apiGetNewsDetail,
    apiUpdateNewsDetail,
    apiDisableNews,
    apiAbleAndTypeNews,
    apiGetNewsHomePage,
  };
};
