import useSWRMutation from "swr/mutation";
import { delRequest, getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { StoreFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeStoreModel } from "@/types/models";
import { DeleteRequestArgs, PutRequestArgs } from "@/types/mutations";

export function useStore(params?: paramsProps, g_params?:paramsProps) {
    const store = getRequest("/api/admin/stores", g_params); 
    const u_store = getRequest("/api/user/stores", params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/stores',
        (url, { arg }) => postRequest<StoreFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/stores",
        (url, { arg }) => putRequest<StoreFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const { trigger: updateUserStore, isMutating: isUpdatingUserStore, error } = useSWRMutation(
        "/api/user/stores",
        (url, { arg }: {arg: PutRequestArgs}) => putRequest<StoreFormData>(url, arg.queryParams, {arg: arg.requestBody})
      );

    const { trigger: DeleteStore, isMutating: isDeleting } = useSWRMutation(
        "/api/user/stores",
        (url, { arg }: {arg: DeleteRequestArgs}) => delRequest<DeleteRequestArgs>(url, arg.queryParams) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<TypeStoreModel>(params)

    const { data, isLoading } = useSWR<TypeStoreModel[]>(
        "/api/admin/stores",
        fetcher
    );

    return { 
        error,
        store,
        u_store,
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