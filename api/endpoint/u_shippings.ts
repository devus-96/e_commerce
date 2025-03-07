import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { ShippingFormData } from "@/types/forms";
import useSWR from "swr";
import { Shipping } from "@/components/modules/sellers/stores/shippings/columns";

export function use_user_shipping (params: paramsProps, g_params?:paramsProps) {
    const shipping = getRequest("/api/user/shippings", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/user/shippings',
        (url, { arg }: {arg: ShippingFormData}) => postRequest<ShippingFormData>(url, { arg }, '/admin/shipping') // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/user/shippings",
        (url, { arg }: {arg: ShippingFormData}) => putRequest<ShippingFormData>(url, params, { arg }, '/admin/shipping') // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Shipping>(params)

    const { data, isLoading } = useSWR<Shipping[]>(
        "/api/user/shippings",
        fetcher
    );

    return { 
        shipping,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}

