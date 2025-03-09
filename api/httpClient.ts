import axios, { AxiosHeaders, AxiosInstance } from "axios";

let httpInstance: AxiosInstance | undefined;

const fetchToken = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/api/token");
  const data = await response.json();
  return data.token;
};

const token = await fetchToken();

export const HttpClient = (): AxiosInstance => {
  if (httpInstance) {
    return httpInstance;
  }

  const headers = AxiosHeaders.from({
    Accept: "application/json",
  });

  if (token) {
      headers.set("Authorization", `Bearer ${token}`);
  }
  

  const instance = axios.create({
    headers,
    //withCredentials: true,
    baseURL:
      process.env.NEXT_PUBLIC_API_URL,
  });

  instance.interceptors.request.use((config) => {
    console.info(`REQUEST (${config.url}) => `, config);

    if (!config.headers.get("Authorization")) {
      const token = fetchToken();

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      console.info(`RESPONSE (${res.config.url}) => `, res);

      return res;
    },
    (error) => {
      console.info(`RESPONSE-ERROR (${error.config.url}) => `, error);

      throw error;
    }
  );

  httpInstance = instance;

  return instance;
};