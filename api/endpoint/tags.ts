import useSWRMutation from "swr/mutation";
import { fetcher, paramsProps, postRequest, putRequest } from "../services";
import { BrandFormData } from "@/types/forms";
import useSWR from "swr";
import { Tag } from "@/components/modules/admin/tags/columns";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getTag (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/tags", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function getTags () {
    return await HttpClient()
      .get("/api/admin/tags")
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        handleError(error);
      })
    };

export function useTag (params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)
    
    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/tags',
        (url, { arg }: {arg: BrandFormData}) => postRequest<BrandFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/tags",
        (url, { arg }: {arg: BrandFormData}) => putRequest<BrandFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<Tag[]>(
        "/api/admin/tags",
        fetcher<Tag>(params)
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