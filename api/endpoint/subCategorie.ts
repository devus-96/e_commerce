import useSWRMutation from "swr/mutation";
import { fetcher, paramsProps, postRequest, putRequest } from "../services";
import { SubcategoryFormData } from "@/types/forms";
import useSWR from "swr";
import { TypeSubCategoryModel } from "@/types/models";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import { useRef } from "react";

export async function getSubcategory (params?: paramsProps) {
return await HttpClient()
  .get("/api/admin/subcategories", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function getSubcategories () {
    return await HttpClient()
      .get("/api/user/subcategories")
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        handleError(error);
      })
    };

export function useSubCategory (params?: paramsProps) {
    const paramsRef = useRef<paramsProps | undefined>(undefined)

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/subcategories',
        (url, { arg }: {arg: SubcategoryFormData}) => postRequest<SubcategoryFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/subcategories",
        (url, { arg }: {arg: SubcategoryFormData}) => putRequest<SubcategoryFormData>(url, paramsRef.current, { arg }) // Passer l'ID de la commande
    );


    const { data, isLoading } = useSWR<TypeSubCategoryModel[]>(
        "/api/admin/subcategories",
        fetcher<TypeSubCategoryModel>(params)
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