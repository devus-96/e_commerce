import useSWRMutation from "swr/mutation";
import { delRequest, paramsProps, postRequest, putRequest, fetcher } from "../services";
import { StoreFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeStoreModel } from "@/types/models";
import { DeleteRequestArgs, PutRequestArgs } from "@/types/mutations";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";
import { toast } from "@/hooks/use-toast";

export async function getStore (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/stores", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function get_user_Store (params?: paramsProps) {
return await HttpClient()
  .get("/api/user/stores", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

async function postStore<T> (url: string, { arg }: {arg: T}) {
    return await HttpClient().post(url, arg).then((response) => {
      const data = response.data;
      if (data.success === false) {
        toast({
          variant: "default",
          title: "Upgrade to pro!",
          description: data.message,
        });
      } else {
        window.location.assign(`/stores/${data.data._id}/dashboard`);
      }
    }).catch((error) => {
      handleError(error);
    }).finally(() => {})
}

export function useStore(params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/stores',
        (url, { arg }: {arg: StoreFormData}) => postRequest<StoreFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger, isMutating, error: err } = useSWRMutation(
      "/api/user/stores",
     (url, { arg }: {arg: StoreFormData}) => postStore<StoreFormData>(url, { arg }) /* options */
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/stores",
        (url, { arg }: {arg: StoreFormData}) => putRequest<StoreFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );

    const { trigger: updateUserStore, isMutating: isUpdatingUserStore, error } = useSWRMutation(
        "/api/user/stores",
        (url, { arg }: {arg: PutRequestArgs}) => putRequest<StoreFormData>(url, arg.queryParams, {arg: arg.requestBody})
      );

    const { trigger: DeleteStore, isMutating: isDeleting } = useSWRMutation(
        "/api/user/stores",
        (url, { arg }: {arg: DeleteRequestArgs}) => delRequest(url, arg.queryParams) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<TypeStoreModel[]>(
        "/api/admin/stores",
        fetcher<TypeStoreModel>(params)
    );

    return {
        trigger,
        paramsRef,
        err,
        isMutating,
        error,
        create,
        isCreating,
        update,
        isUpdating,
        updateUserStore,
        isUpdatingUserStore,
        DeleteStore,
        isDeleting,
        data,
        isLoading
    }

}