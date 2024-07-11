import { axiosPublic } from "../axiosInstance";
import { WARRANTY, WARRANTY_ID } from "../pathApiName";
import { useState } from "react";
import axios from "axios";

export const ApiWarranty = () => {
    const [loading, setLoading] = useState(false);

    const apiGetWarranty = async () => {
        setLoading(true);
        try {
            const response = await axiosPublic.get(WARRANTY);
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


    const apiGetWarrantyById = async (id: string) => {
        setLoading(true);

        try {
            const response = await axiosPublic.get(WARRANTY_ID.replace(":id", id));

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


    return { apiGetWarranty, apiGetWarrantyById, loading };
};