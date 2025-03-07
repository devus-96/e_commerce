import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { BrandFormData } from "@/types/forms";
import useSWR from "swr";
import { Brand } from "@/components/modules/admin/brands/columns";

export function useBrand (params: paramsProps, g_params?:paramsProps) {
    const p_brand = getRequest("/api/user/brands");
    const a_brand = getRequest("/api/admin/brands", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/brands',
        (url, { arg }) => postRequest<BrandFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/brands",
        (url, { arg }) => putRequest<BrandFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Brand>(params)

    const { data, isLoading } = useSWR<Brand[]>(
        "/api/admin/brands",
        fetcher
    );

    return { 
        p_brand,
        a_brand,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}