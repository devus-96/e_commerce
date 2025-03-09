import { fetcher, paramsProps, postRequest } from "../services";
import useSWR from "swr";
import { Subscription } from "@/components/modules/admin/subscriptions/columns";
import useSWRMutation from "swr/mutation";
import { CheckoutFormData } from "@/types/forms";
import { HttpClient } from "../httpClient";
import { handleError } from "../toast";
import getStripe from "@/lib/get-stripejs";
import { toast } from "@/hooks/use-toast";

export async function getUserSubscription (params?: paramsProps) {
return await HttpClient()
  .get("/api/user/subscriptions", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function getAdminSubscription (params?: paramsProps) {
    return await HttpClient()
      .get("/api/admin/subscriptions", {
        params: params ? params : undefined,
      })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        handleError(error);
      })
    };

    export const getPayments = async (params?: paramsProps) => {
      //get user token    
      return await HttpClient()
      .get("/api/admin/payments", {
        params: params ? params : undefined,
      })
      .then((response) => {
        return response.data.data[0].totalEarning;
      })
      .catch((error) => {
        handleError(error);
      })
    };
    
async function postSuscription(url: string, { arg }: { arg: CheckoutFormData }) {
      return await HttpClient()
        .post(process.env.NEXT_PUBLIC_API_URL + url, arg)
        .then(async (response) => {
          const data = response.data;
          toast({
            variant: "default",
            title: "OK...✔️",
            description: data.message,
          });
  
          const stripe = await getStripe();
          await stripe!.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: response.data.id,
          });
        })
        .catch((err) => {
          console.log(err.message);
        })
        .finally(() => {});
    }

export function useSubscriptions (params?: paramsProps) {
    const { trigger: create, isMutating: isCreating } = useSWRMutation(
        '/api/user/subscriptions',
        (url, { arg }) => postRequest<CheckoutFormData>(url, { arg }) // Passer l'ID de la commande
    );

    const { trigger: createSubcription, isMutating: isCreatingSubscription } = useSWRMutation(
      "/api/user/subscriptions",
      (url, { arg }: {arg: CheckoutFormData}) => postSuscription(url, { arg }) /* options */
    );
  

    const { data, isLoading } = useSWR<Subscription[]>(
        "/api/admin/subscriptions",
        fetcher<Subscription>(params)
    );

    return {
        data,
        isLoading,
        create,
        isCreating,
        createSubcription,
        isCreatingSubscription
    }

}