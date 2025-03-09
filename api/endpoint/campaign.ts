import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import useSWR from "swr";
import { TypeSlideItemModel } from "@/types/models";
import { SlideitemFormData } from "@/types/forms";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getCampaign (params?: paramsProps) {
return await HttpClient()
  .get("/api/user/campaigns", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export function useCampaigns (params?: paramsProps, storeId?:string) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/user/campaigns',
        (url, { arg } : {arg: SlideitemFormData}) => postRequest<SlideitemFormData>(url, { arg }, `/stores/${storeId}/campaigns`) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/user/campaigns",
        (url, { arg }: {arg: SlideitemFormData}) => putRequest<SlideitemFormData>(url, paramsRef.current, { arg }, `/stores/${storeId}/campaigns`) // Passer l'ID de la commande
      );


    const { data, isLoading } = useSWR<TypeSlideItemModel[]>(
        "/api/user/campaigns",
        fetcher<TypeSlideItemModel>(params)
    );

    return {
        create,
        isCreating,
        update,
        isUpdating,
        paramsRef,
        data,
        isLoading,
    }
}