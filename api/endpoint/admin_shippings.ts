import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { ShippingFormData } from "@/types/forms";
import useSWR from "swr";
import { Shipping } from "@/components/modules/admin/shippings/columns";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getAdminShipping (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/shippings", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export function use_admin_shipping (params?: paramsProps) {
  const paramsRef = useRef<paramsProps | undefined>(undefined) 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/shippings',
        (url, { arg }: {arg: ShippingFormData}) => postRequest<ShippingFormData>(url, { arg }, `/admin/shippings`) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/shippings",
        (url, { arg }: {arg: ShippingFormData}) => putRequest<ShippingFormData>(url, paramsRef.current, { arg }, `/admin/shippings`) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<Shipping[]>(
        "/api/admin/shippings",
        fetcher<Shipping>(params)
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

