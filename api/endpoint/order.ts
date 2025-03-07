import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, putRequest, searchResquest } from "../services";
import { TypeOrderItemModel } from "@/types/models";
import { Order } from "@/components/modules/sellers/stores/orders/columns";
import useSWR from "swr";

export function useOrder (params: paramsProps, trackorders_params?: paramsProps, trackorders_arg?: { status: string }) {
    let updateTrackOrder;
    const order = getRequest("/api/user/orderitems", params);
    if (trackorders_arg) {
        updateTrackOrder = putRequest<{ status: string }>("/api/user/trackorders", trackorders_params, {arg: trackorders_arg});
    }

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/user/orderitems',
        (url, { arg }) => putRequest<TypeOrderItemModel>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Order>(params)

    const { data, isLoading } = useSWR<Order[]>(
        "/api/user/orderitems",
        fetcher
    );

    return {
        order,
        updateTrackOrder,
        create,
        isCreating,
        data,
        isLoading
    }

}