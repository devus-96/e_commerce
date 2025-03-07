import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { CategoryFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeCategoryModel } from "@/types/models";

export function useCategorie (params: paramsProps, g_params?:paramsProps) {
    const p_categories = getRequest("/api/user/categories");
    const a_categories = getRequest("/api/admin/categories", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/categories',
        (url, { arg }) => postRequest<CategoryFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/categories",
        (url, { arg }) => putRequest<CategoryFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<TypeCategoryModel>(params)

    const { data, isLoading } = useSWR<TypeCategoryModel[]>(
        "/api/admin/categories",
        fetcher
    );

    return { 
        p_categories,
        a_categories,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}