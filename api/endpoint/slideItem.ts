import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { SlideitemFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeSlideItemModel } from "@/types/models";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";


export async function getSlideItem (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/slideitems", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export function useSlideItem(params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/slideitems',
        (url, { arg }: {arg: SlideitemFormData}) => postRequest<SlideitemFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/slideitems",
        (url, { arg }: {arg: SlideitemFormData}) => putRequest<SlideitemFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<TypeSlideItemModel[]>(
        "/api/admin/slideitems",
        fetcher<TypeSlideItemModel>(params)
    );

    return { 
        paramsRef,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}