import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { SlideFormData } from "@/types/forms";
import { Slide } from "@/components/modules/admin/slides/columns";
import useSWR from "swr";

export function useSlides (params?: paramsProps, g_params?:paramsProps) {
    const p_slides = getRequest("/api/public/slides");
    const a_slides = getRequest("/api/admin/slides", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/admin/slides',
        (url, { arg }) => postRequest<SlideFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/admin/slides",
        (url, { arg }) => putRequest<SlideFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Slide>(params)

    const { data, isLoading } = useSWR<Slide[]>(
        "/api/user/campaigns",
        fetcher
    );

    return { 
        p_slides,
        a_slides,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }
}