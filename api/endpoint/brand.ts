"use client"
import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { BrandFormData } from "@/types/forms";
import useSWR from "swr";
import { Brand } from "@/components/modules/admin/brands/columns";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";


export async function getBrand (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/brands", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function getBrands () {
  return await HttpClient()
.get("/api/user/brands")
.then((response) => {
  return response.data.data;
})
.catch((error) => {
  handleError(error);
})
}


export function useBrand (params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/brands',
        (url, { arg }: {arg: BrandFormData}) => postRequest<BrandFormData>(url, { arg }, `/admin/brands`) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/brands",
        (url, { arg }: {arg: BrandFormData}) => putRequest<BrandFormData>(url, paramsRef.current , { arg }, `/admin/brands`) // Passer l'ID de la commande
    );

    const { data, isLoading } = useSWR<Brand[]>(
        "/brands",
        fetcher<Brand>(params)
    );

    return { 
        create,
        isCreating,
        update, 
        isUpdating,
        paramsRef,
        data,
        isLoading
    }

}