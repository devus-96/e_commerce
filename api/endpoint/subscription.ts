import { getRequest, paramsProps, postRequest, searchResquest } from "../services";
import useSWR from "swr";
import { Subscription } from "@/components/modules/admin/subscriptions/columns";
import useSWRMutation from "swr/mutation";
import { CheckoutFormData } from "@/types/forms";

export function useSubscriptions (params: paramsProps, g_params?:paramsProps) {
    const a_subscription = getRequest("/api/admin/subscriptions", g_params); 
    const u_subscription = getRequest("/api/user/subscriptions", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/user/subscriptions',
        (url, { arg }) => postRequest<CheckoutFormData>(url, { arg }) // Passer l'ID de la commande
    );
    
    const fetcher = searchResquest<Subscription>(params)

    const { data, isLoading } = useSWR<Subscription[]>(
        "/api/admin/subscriptions",
        fetcher
    );

    return {
        a_subscription,
        u_subscription,
        data,
        isLoading,
        create,
        isCreating
    }

}