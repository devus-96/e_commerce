import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { PmethodFormData } from "@/types/forms";
import useSWR from "swr";
import { Pmethod } from "@/components/modules/admin/pmethods/columns";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getPmethod (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/pmethods", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export function usePmethod (params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/pmethods',
        (url, { arg }: {arg: PmethodFormData}) => postRequest<PmethodFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/pmethods",
        (url, { arg }: {arg: PmethodFormData}) => putRequest<PmethodFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<Pmethod[]>(
        "/api/admin/pmethods",
        fetcher<Pmethod>(params)
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