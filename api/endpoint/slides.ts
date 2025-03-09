import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { SlideFormData } from "@/types/forms";
import useSWR from "swr";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getSlide (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/slides", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function getSlides () {
    return await HttpClient()
      .get("/api/public/slides")
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        handleError(error);
      })
    };

export function useSlide<T>(params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)
    
    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/slides',
        (url, { arg }: {arg: SlideFormData}) => postRequest<SlideFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/slides",
        (url, { arg }: {arg: SlideFormData}) => putRequest<SlideFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );


    const { data, isLoading } = useSWR<T[]>(
        "/api/user/campaigns",
        fetcher<T>(params)
    );

    return { 
        paramsRef,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }
}