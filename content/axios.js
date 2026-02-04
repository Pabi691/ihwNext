import axios from "axios";
import { ENV } from "../config/env";

const instance = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/* 🔐 REQUEST INTERCEPTOR */
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("userToken") || ENV.WEB_TOKEN;
        //    console.log("Axios Token:", token);     
        return {
            ...config,
            headers: {
                ...config.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        };
    },
    (error) => Promise.reject(error)
);

/* 🚨 RESPONSE INTERCEPTOR */
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                console.error("Unauthorized! Redirecting to login...");
            }
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

export default instance;