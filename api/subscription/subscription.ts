import { CheckoutFormData } from "@/types/forms";
import { create } from "zustand";
import { initRessources, ResourceState } from "../ressources";
import { TypeSubscriptionModel } from "@/types/models";

interface Subscription extends ResourceState<TypeSubscriptionModel> {}

export const useSubsCriptions = create<Subscription>((set) => ({
  ...initRessources(`${process.env.NEXT_PUBLIC_API_URL}`, set)
}))