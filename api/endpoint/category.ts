import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { CategoryFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeCategoryModel } from "@/types/models";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getCategory (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/categories", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function getCategories () {
    return await HttpClient()
  .get("/api/user/categories")
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
}

export function useCategory (params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/categories',
        (url, { arg }: {arg: CategoryFormData}) => postRequest<CategoryFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/categories",
        (url, { arg }: {arg: CategoryFormData}) => putRequest<CategoryFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );


    const { data, isLoading } = useSWR<TypeCategoryModel[]>(
        "/api/admin/categories",
        fetcher<TypeCategoryModel>(params)
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