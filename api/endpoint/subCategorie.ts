import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { SubcategoryFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeSubCategoryModel } from "@/types/models";

export function useSubCategorie (params: paramsProps, g_params?:paramsProps) {
    const p_subCategorie = getRequest("/api/user/subcategories");
    const a_subCategorie = getRequest("/api/admin/subcategories", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/subcategories',
        (url, { arg }) => postRequest<SubcategoryFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/subcategories",
        (url, { arg }) => putRequest<SubcategoryFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<TypeSubCategoryModel>(params)

    const { data, isLoading } = useSWR<TypeSubCategoryModel[]>(
        "/api/admin/subcategories",
        fetcher
    );

    return { 
        p_subCategorie,
        a_subCategorie,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}