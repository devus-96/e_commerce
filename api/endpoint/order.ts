import useSWRMutation from "swr/mutation";
import { paramsProps, putRequest, fetcher } from "../services";
import { Order } from "@/components/modules/sellers/stores/orders/columns";
import useSWR from "swr";
import { HttpClient } from "../httpClient";
import { handleError, handleSuccess } from "../toast";

export async function getOrder (params: paramsProps) {
return await HttpClient()
  .get("/api/user/orderitem", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function putTrackOrder(params: paramsProps, arg: paramsProps) {
    return await HttpClient().put("/api/user/trackorders", arg, {
      params: params ? params : undefined
     }).then((response) => {
        handleSuccess(response, undefined)
      return Promise.resolve(response.data.data);
     }).catch((error) => {
      handleError(error);
     })
}

export function useOrder (params: paramsProps) {

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        '/api/user/orderitems',
        (url, { arg }: {arg: { status: string }}) => putRequest<{ status: string }>(url, params, { arg }) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<Order[]>(
        "/api/user/orderitems",
        fetcher<Order>(params)
    );

    return {
        update,
        isUpdating,
        data,
        isLoading
    }

}