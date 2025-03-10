import { Fetcher } from "swr";
import { HttpClient } from "./httpClient";
import { handleError, handleSuccess } from "./toast";
import { toast } from "@/hooks/use-toast";

export type paramsProps = {
    [key: string]: string | number | undefined | null
}

export function fetcher <T> (params?: paramsProps) {
    const fetcher: Fetcher<T[], string> = async (url) => {
      return await HttpClient()
        .get(url, {
          params: params ? params : undefined,
        })
        .then((res) => res.data.data)
        .catch((err) => {
          handleError(err);
        })
    };
    return fetcher
}

export async function getRequest (url: string, params?: paramsProps) {
return await HttpClient()
  .get(url, {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function postRequest<T> (url: string, { arg }: {arg: T}, endpoint?: string) {
    return await HttpClient().post(url, arg).then((response) => {
        handleSuccess(response, endpoint)
      return Promise.resolve(response.data.data);
    }).catch((error) => {
      handleError(error);
    }).finally(() => {
      window.location.reload()
    })
}

export async function putRequest<T> (url: string, params: paramsProps | undefined, { arg }: {arg: T}, endpoint?: string | undefined) {
  console.log(params)
    return await HttpClient().put(url, arg, {
      params: params ? params : undefined
     }).then((response) => {
        handleSuccess(response, endpoint)
      return Promise.resolve(response.data.data);
     }).catch((error) => {
      handleError(error);
     })
}

export async function delRequest(url: string, params: paramsProps | undefined) {
      return await HttpClient()
        .delete(url, {
          params: params ? params : undefined
        })
        .then((response) => {
          const data = response.data;
          toast(data.message);
          return response.data
        })
        .catch((error) => {
          handleError(error);
        })
        .finally(() => {
          window.location.reload();
        });
}