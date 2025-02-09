import { z, ZodType } from "zod";

export type CheckoutFormData = {
    user_id: string;
    amount: number;
  };

export const checkoutValidationSchema: ZodType<CheckoutFormData> = z.object({
  user_id: z.string(),
  amount: z.number().min(1),
});