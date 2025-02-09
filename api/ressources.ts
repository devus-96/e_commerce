import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { Dispatch, SetStateAction } from "react";

export type SearchParams = Record<string, number | string>;

export type ApiRouteParam = string | number | SearchParams;

export interface ResourceState<T> {
    items: T;
    search: (url: string, stopLoading: Dispatch<SetStateAction<boolean>>, params?: SearchParams) => Promise<void>;
    create: (url: string, data: Partial<T> | unknown, stopLoading?: Dispatch<SetStateAction<boolean>>) => Promise<any>;
    update: (url: string, data: Partial<T> | unknown, params: SearchParams | {}) => Promise<any>;
    destroy: (url: string, params: SearchParams | {}, stopLoading?: Dispatch<SetStateAction<boolean>>, redirect?: string) => Promise<any>;
  }
 
export const initRessources = <T>(apiRoute: string, set: any) => ({
  items: null as T,
  search: (url: string, stopLoading: Dispatch<SetStateAction<boolean>>, params: SearchParams = {}) => {
    return getHttpClient()
      .get(apiRoute + url, {
        params: params
      })
      .then((res) => {
        set(() => ({
          items: res.data.data,
        }));
      })
      .catch((err) => {
        return err
      })
      .finally(() => {
        stopLoading(false)
      })
  },
  create: (url: string, data: Partial<T> | unknown, stopLoading?: Dispatch<SetStateAction<boolean>>) => {
    return getHttpClient().post(apiRoute + url, data)
    .then((res) => {
        return res
    })
    .catch((err) => {
        return err
    })
    .finally(() => {
        if (stopLoading) {
            stopLoading(false)
        } else {
            window.location.reload();
        }
    })
  },
  update: (url: string, data: Partial<T> | unknown, params: SearchParams = {}, stopLoading?: Dispatch<SetStateAction<boolean>>) => {
    return getHttpClient().put(apiRoute + url, data, {params: params})
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
            })
            .finally(() => {
                if (stopLoading) {
                    stopLoading(false)
                } else {
                    window.location.reload();
                }
            })
  },
  destroy: (url: string, params: SearchParams = {}, stopLoading?: Dispatch<SetStateAction<boolean>>, redirect?: string) => {
    return getHttpClient().delete(apiRoute+ url, {params: params})
    .then((res) => {
      return res
      })
      .catch((err) => {
          return err
      })
      .finally(() => {
          if (stopLoading) {
              stopLoading(false)
          }else if (redirect) {
            window.location.assign(redirect)
          } else {
              window.location.reload();
          }
      })
  },
})