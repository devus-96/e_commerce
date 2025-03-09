import useSWRMutation from "swr/mutation";
import { paramsProps, postRequest, putRequest, fetcher } from "../services";
import { WithdrawalFormData } from "@/types/forms";
import useSWR from "swr";
import { Withdrawl } from "@/components/modules/sellers/stores/withdrawals/columns";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";

export async function getWithdrawal (params?: paramsProps) {
return await HttpClient()
  .get("/api/user/withdrawals", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export function useWithdrawals (params?: paramsProps) {

    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        "/api/user/withdrawals",
        (url, { arg }: {arg: WithdrawalFormData}) => postRequest<WithdrawalFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: update, isMutating: isUpdating } = useSWRMutation(
        "/api/user/withdrawals",
        (url, { arg }: {arg: WithdrawalFormData}) => putRequest<WithdrawalFormData>(url, params, { arg }) // Passer l'ID de la commande
    );

    const { data: withdrawals, isLoading: loading } = useSWR<Withdrawl[]>(
        "/api/user/withdrawals",
        fetcher<Withdrawl>(params)
    );

    const { data, isLoading } = useSWR<Withdrawl[]>(
        "/api/admin/withdrawals",
        fetcher<Withdrawl>(params)
    );

    return { 
        withdrawals,
        loading,
        create,
        isCreating,
        update,
        isUpdating,
        data,
        isLoading
    }

}