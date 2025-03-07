import useSWRMutation from "swr/mutation";
import { putRequest } from "../services";
import { SwitchRequestArgs } from "@/types/mutations";

export function useUser () {
    const { trigger: SwitchAccount, isMutating: isSwitching, error } = useSWRMutation(
        "/api/user/stores",
        (url, { arg }: {arg: SwitchRequestArgs}) => putRequest<{userId: string; role: string;}>(url, undefined, {arg: arg.queryParams,})
      );
    
    return {
        SwitchAccount,
        isSwitching,
        error
    }
}