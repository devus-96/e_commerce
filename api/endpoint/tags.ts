import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { BrandFormData } from "@/types/forms";
import useSWR from "swr";
import { Tag } from "@/components/modules/admin/tags/columns";

export function useTags (params: paramsProps, g_params?:paramsProps) {
    const p_tags = getRequest("/api/user/tags");
    const a_tags = getRequest("/api/admin/tags", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/tags',
        (url, { arg }) => postRequest<BrandFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/tags",
        (url, { arg }) => putRequest<BrandFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Tag>(params)

    const { data, isLoading } = useSWR<Tag[]>(
        "/api/admin/tags",
        fetcher
    );

    return { 
        p_tags,
        a_tags,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}