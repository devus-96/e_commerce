import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { SlideitemFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeSlideItemModel } from "@/types/models";

export function useSlideItem(params: paramsProps, g_params?:paramsProps) {
    const slideItem = getRequest("/api/admin/slideitems", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/slideitems',
        (url, { arg }) => postRequest<SlideitemFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/slideitems",
        (url, { arg }) => putRequest<SlideitemFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<TypeSlideItemModel>(params)

    const { data, isLoading } = useSWR<TypeSlideItemModel[]>(
        "/api/admin/slideitems",
        fetcher
    );

    return { 
        slideItem,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}