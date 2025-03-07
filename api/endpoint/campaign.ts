import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import useSWR from "swr";
import { TypeSlideItemModel } from "@/types/models";
import { SlideitemFormData } from "@/types/forms";


export function useCampaigns (params: paramsProps, g_params?:paramsProps, storeId?:string) {
    const campaings = getRequest('/api/user/campaigns', g_params)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/user/campaigns',
        (url, { arg } : {arg: SlideitemFormData}) => postRequest<SlideitemFormData>(url, { arg }, `/stores/${storeId}/campaigns`) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/user/campaigns",
        (url, { arg }: {arg: SlideitemFormData}) => putRequest<SlideitemFormData>(url, params, { arg }, `/stores/${storeId}/campaigns`) // Passer l'ID de la commande
      );

    const fetcher = searchResquest<TypeSlideItemModel>(params)

    const { data, isLoading } = useSWR<TypeSlideItemModel[]>(
        "/api/user/campaigns",
        fetcher
    );

    return {
        campaings,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading,
    }
}