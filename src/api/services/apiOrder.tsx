import { axiosPublic } from "../axiosInstance";
import { ORDER } from "../pathApiName";
import { useState } from "react";
import axios from "axios";


export const ApiOrder = () => {
    const [loading, setLoading] = useState(false);

    const apiGetOrder = async () => {
        setLoading(true);
        try {
            const response = await axiosPublic.get(ORDER);

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

    return { apiGetOrder, loading };
};