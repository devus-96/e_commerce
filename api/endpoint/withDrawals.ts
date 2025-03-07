import useSWRMutation from "swr/mutation";
import { getRequest, paramsProps, postRequest, putRequest, searchResquest } from "../services";
import { WithdrawalFormData } from "@/types/forms";
import useSWR from "swr";
import { Withdrawl } from "@/components/modules/sellers/stores/withdrawals/columns";

export function useWithdrawals (params: paramsProps, g_params?:paramsProps) {
    const withdrawals = getRequest("/api/user/withdrawals", g_params); 

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        "/api/user/withdrawals",
        (url, { arg }: {arg: WithdrawalFormData}) => postRequest<WithdrawalFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/user/withdrawals",
        (url, { arg }: {arg: WithdrawalFormData}) => putRequest<WithdrawalFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const fetcher = searchResquest<Withdrawl>(params)

    const { data, isLoading } = useSWR<Withdrawl[]>(
        "/api/user/withdrawals",
        fetcher
    );

    /*function getWithDrawals () {
        const fetcher = searchResquest<Withdrawl>(params)

        const { data, isLoading } = useSWR<Withdrawl[]>(
            "/api/admin/withdrawals",
            fetcher
        );

        return {
            data,
            isLoading
        }

    }*/

    return { 
        withdrawals,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading,
        //getWithDrawals
    }

}