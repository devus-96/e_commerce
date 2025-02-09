import { subscriptionPlan } from "@/constants";
import { toast } from "@/hooks/use-toast";
import getStripe from "@/api/subscription/get-stripejs";
import { CheckoutFormData } from "@/types/forms";
import { TypeSubscriptionModel } from "@/types/models";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useSubsCriptions } from "./subscription";
import { getHttpClient } from "@/lib/http";


export function useStripeSubscription() {
  const subcriptions = useSubsCriptions()
  const { userId } = useAuth();
  const [subscription, setSubscription] = useState<TypeSubscriptionModel | null>(null);
  const [isFetchingSubscription, setFetchingSubscription] = useState(false);
  const [isCreatingSubscription, setCreatingSubscription] = useState(false);

  // Récupérer l'abonnement de l'utilisateur
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!userId) return; 
      setFetchingSubscription(true);
      getHttpClient().get("/api/user/subscriptions", {
        params: {id: userId}
      }).then(() => {
        setSubscription(subcriptions.items);
      }).catch((err) => {
        toast({
          variant: 'default',
          title: 'OOps ❌',
          description: err.message,
        });
      })
      .finally(() => {
        setFetchingSubscription(false)
      })
    };
    fetchSubscription();
  }, [userId]);

  // Fonction pour créer un abonnement Stripe
  const createSubscription = async (url:string, data: CheckoutFormData) => {
    if (!userId) {
      window.location.assign("/sign-in");
      return;
    }
    if (subscription?.type === "pro" && subscription.status === "active") {
      toast({
        variant: "default",
        title: "Already subscribed",
        description: "You have an active subscription.",
      });
      return;
    }
    setCreatingSubscription(true);
    getHttpClient().post(url, data).then( async (response) => {
      toast({
        variant: "default",
        title: "Success...✔️",
        description: response.data.message,
      });

      const stripe = await getStripe();
      await stripe!.redirectToCheckout({
        sessionId: response.data.id,
      });
    })
    .catch((err) => {
      toast({
        variant: 'default',
        title: 'OOps ❌',
        description: err.message,
      });
    })
    .finally(() => {
      setCreatingSubscription(false)
    })
      
  };

  // Utilisation de useSWRMutation pour gérer la création d'abonnement
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/user/subscriptions",
    async (url, { arg }: { arg: CheckoutFormData }) => {
      await createSubscription(url, arg);
    }
  );

  // Fonction pour soumettre le formulaire
  const onSubmit = async () => {
    const data = {
      user_id: userId || "",
      amount: subscriptionPlan[1].price,
    };
    await create(data);
  };

  return {
    subscription,
    onSubmit,
    isCreating,
    isLoading: isFetchingSubscription || isCreatingSubscription,
  };
}