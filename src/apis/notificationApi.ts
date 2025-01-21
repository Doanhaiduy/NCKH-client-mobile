import { AxiosRequestConfig } from "axios";
import axiosClient from "./index";
import { Platform } from "react-native";
import QueryString from "qs";
import { appInfo } from "@/constants/appInfo";

class NotificationAPI {
    HandleNotification = async <T>(
        url: string,
        data?: any,
        method?: "get" | "post" | "put" | "delete",
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/notifications${url}`, {
            method: method || "get",
            data,
            params: method === "get" ? data : undefined,
            ...options,
        });
    };

    readNotification = async (
        params: {
            _id: string;
            userId: string;
        },
        option: AxiosRequestConfig = {},
    ): Promise<any> => {
        return await this.HandleNotification(`/${params._id}/read/${params.userId}`, undefined, "put", option);
    };
}

const notificationAPI = new NotificationAPI();

export default notificationAPI;
