import axios, { AxiosHeaders, AxiosInstance } from "axios";
import { useAuth } from "@clerk/nextjs";

var httpInstance: AxiosInstance | undefined;

export const getHttpClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  if (httpInstance) {
    return httpInstance;
  }

  const headers = AxiosHeaders.from({
    Accept: "application/json",
  });

  
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  

  const instance = axios.create({
    headers,
    withCredentials: true,
    baseURL:
      process.env.NEXT_PUBLIC_API_URL || "https://api.symphonisocial.com/api",
  });

  const isDev = process.env.NODE_ENV !== "production";

  instance.interceptors.request.use((config) => {
    isDev && console.info(`REQUEST (${config.url}) => `, config);

    if (!config.headers.get("Authorization")) {
      const token = getToken();

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      isDev && console.info(`RESPONSE (${res.config.url}) => `, res);

      return res;
    },
    (error) => {
      isDev && console.info(`RESPONSE-ERROR (${error.config.url}) => `, error);

      throw error;
    }
  );

  httpInstance = instance;

  return instance;
};