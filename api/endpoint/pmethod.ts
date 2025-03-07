import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { PmethodFormData } from "@/types/forms";
import useSWR from "swr";
import { Pmethod } from "@/components/modules/admin/pmethods/columns";

export function usePmethod (params: paramsProps, g_params?:paramsProps) {
    const pmethod = getRequest("/api/admin/pmethods", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/pmethods',
        (url, { arg }) => postRequest<PmethodFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/pmethods",
        (url, { arg }) => putRequest<PmethodFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Pmethod>(params)

    const { data, isLoading } = useSWR<Pmethod[]>(
        "/api/admin/pmethods",
        fetcher
    );

    return { 
        pmethod,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}