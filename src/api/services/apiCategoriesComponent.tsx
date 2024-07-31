/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { axiosPublic } from "../axiosInstance";
import {
  CATEGORY_COMPONENT,
  CATEGORY_ID_COMPONENT,
  GET_CATEGORY_COMPONENT,
  MACHINERY_COMPONENT_CHILD,
} from "../pathApiName";
import { useState } from "react";
import { CategoryProps } from "../../models/category";
import config from "../../configs";

export const CategoryComponentApi = () => {
  const [loading, setLoading] = useState(false);

  const getCategoryComponent = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(GET_CATEGORY_COMPONENT);
      setLoading(false);
      return response.data;
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

  const addCategoryComponent = async (params: CategoryProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.post(CATEGORY_COMPONENT, params);
      setLoading(false);
      return response;
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

  const updateCategoryComponent = async (id: string, params: CategoryProps) => {
    try {
      setLoading(true);
      const response = await axiosPublic.put(
        CATEGORY_ID_COMPONENT.replace(":id", id),
        params
      );
      setLoading(false);
      return response.data;
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

  const getCategoryComponentChild = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(MACHINERY_COMPONENT_CHILD);
      setLoading(false);
      return response.data;
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
  //   const getCategoryName = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosPublic.get(CATEGORY);
  //       setLoading(false);
  //       return response.data;
  //     } catch (error: any) {
  //       if (axios.isAxiosError(error) && error.response) {
  //         return error.response.data;
  //       } else {
  //         return { statusCode: 500, Error: config.MessageNotice.Error500 };
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const getCategoryParent = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosPublic.get(GET_CATEGORY_PARENT);

  //       setLoading(false);

  //       return response.data;
  //     } catch (error: any) {
  //       if (axios.isAxiosError(error) && error.response) {
  //         return error.response.data;
  //       } else {
  //         return { statusCode: 500, Error: config.MessageNotice.Error500 };
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const getCategoryChild = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosPublic.get(GET_CATEGORY_CHILD);

  //       setLoading(false);

  //       return response.data;
  //     } catch (error: any) {
  //       if (axios.isAxiosError(error) && error.response) {
  //         return error.response.data;
  //       } else {
  //         return { statusCode: 500, Error: config.MessageNotice.Error500 };
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   const deleteCategory = async (id: string) => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosPublic.delete(CATEGORY_ID.replace(":id", id));

  //       setLoading(false);
  //       return response.data;
  //     } catch (error: any) {
  //       if (axios.isAxiosError(error) && error.response) {
  //         return error.response.data;
  //       } else {
  //         return { statusCode: 500, Error: config.MessageNotice.Error500 };
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return {
    loading,
    getCategoryComponent,
    addCategoryComponent,
    updateCategoryComponent,
    getCategoryComponentChild,
    // getCategoryName,
    // deleteCategory,
    // getCategoryParent,
    // getCategoryChild,
  };
};
