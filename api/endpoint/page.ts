import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { PageFormData } from "@/types/forms";
import useSWR from "swr";
import { Page } from "@/components/modules/admin/pages/columns";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getPage (params: paramsProps) {
return await HttpClient()
  .get("/api/admin/pages", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export function usePage (params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/pages',
        (url, { arg }: {arg: PageFormData}) => postRequest<PageFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/pages",
        (url, { arg }: {arg: PageFormData}) => putRequest<PageFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<Page[]>(
        "/api/admin/pages",
        fetcher<Page>(params)
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