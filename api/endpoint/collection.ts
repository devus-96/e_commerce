import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { CollectionFormData } from "@/types/forms";
import useSWR from "swr";
import { Collection } from "@/components/modules/admin/collections/columns";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getCollection (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/collections", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function getCollections () {
    return await HttpClient()
  .get("/api/user/collections")
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
}

export function useCollection (params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/collections',
        (url, { arg }: {arg: CollectionFormData}) => postRequest<CollectionFormData>(url, { arg }, "/admin/collections") // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/collections",
        (url, { arg }: {arg: CollectionFormData}) => putRequest<CollectionFormData>(url, paramsRef.current, { arg }, '/admin/collections') // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<Collection[]>(
        "/api/admin/collections",
        fetcher<Collection>(params)
    );

    return { 
        create,
        isCreating,
        update,
        isUpdating,
        paramsRef,
        data,
        isLoading
    }

}