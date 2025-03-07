import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { ShippingFormData } from "@/types/forms";
import useSWR from "swr";
import { Shipping } from "@/components/modules/admin/shippings/columns";

export function use_admin_shipping (params: paramsProps, g_params?:paramsProps) {
    const admin_shipping = getRequest("/api/admin/shippings", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/shippings',
        (url, { arg }) => postRequest<ShippingFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/shippings",
        (url, { arg }) => putRequest<ShippingFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Shipping>(params)

    const { data, isLoading } = useSWR<Shipping[]>(
        "/api/admin/shippings",
        fetcher
    );

    return { 
        admin_shipping,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}

