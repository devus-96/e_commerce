import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { PageFormData } from "@/types/forms";
import useSWR from "swr";
import { Page } from "@/components/modules/admin/pages/columns";

export function usePage (params: paramsProps, g_params?:paramsProps) {
    const page = getRequest("/api/admin/pages", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/pages',
        (url, { arg }) => postRequest<PageFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/pages",
        (url, { arg }) => putRequest<PageFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Page>(params)

    const { data, isLoading } = useSWR<Page[]>(
        "/api/admin/pages",
        fetcher
    );

    return { 
        page,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}