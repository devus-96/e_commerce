import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { CollectionFormData } from "@/types/forms";
import useSWR from "swr";
import { Collection } from "@/components/modules/admin/collections/columns";

export function useCollection (params: paramsProps, g_params?:paramsProps) {
    const p_collection = getRequest("/api/user/collections");
    const a_collection = getRequest("/api/admin/collections", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/collections',
        (url, { arg }) => postRequest<CollectionFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/collections",
        (url, { arg }) => putRequest<CollectionFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Collection>(params)

    const { data, isLoading } = useSWR<Collection[]>(
        "/api/admin/collections",
        fetcher
    );

    return { 
        p_collection,
        a_collection,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}