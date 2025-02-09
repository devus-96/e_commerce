import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "@clerk/nextjs";
import { checkoutValidationSchema } from "@/api/subscription/type"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionPlan } from "@/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Loading from "./Loading";
import { useStripeSubscription } from "@/api/subscription/stripeSouscription";

export default function PricingCard({ data }: { data: any }) {
  const { userId } = useAuth();
  const {subscription, onSubmit, isLoading, isCreating} = useStripeSubscription()


  // 1. Define your validation.
  const form = useForm<z.infer<typeof checkoutValidationSchema>>({
    resolver: zodResolver(checkoutValidationSchema),
    defaultValues: {
      user_id: userId ? userId : "",
      amount: subscriptionPlan[1].price,
    },
  });

  return (
    <>
      {isLoading && <Loading loading={true} />}
      <div className="w-full min-w-[360px] bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 p-4 flex flex-col gap-8">
        <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
          {data.type}
        </h5>
        <div className="flex items-baseline text-gray-900 dark:text-white">
          <span className="text-3xl font-semibold">$</span>
          <span className="text-5xl font-extrabold tracking-tight">
            {data.price}
          </span>
          <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
            /{data.period}
          </span>
        </div>
        <ul role="list" className="space-y-5 my-7">
          {data.roles.map((item: any, idx: number) => (
            <li
              key={idx}
              className={cn(
                "flex items-center",
                item.active ? "" : "line-through decoration-gray-500"
              )}
            >
              <FaCheckCircle
                className={cn(
                  "flex-shrink-0 w-4 h-4",
                  item.active
                    ? "text-blue-700 dark:text-white"
                    : "text-gray-500 dark:text-gray-500"
                )}
              />
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Button
            type="submit"
            variant="default"
            className={cn(
              "capitalize w-full",
              subscription?.type === data.type &&
                "bg-white text-black border border-border hover:text-white"
            )}
            disabled={
              isCreating || isLoading || subscription?.type === data.type
            }
          >
            {subscription?.type === data.type ? "current plan" : "Buy now"}
          </Button>
        </form>
      </div>
    </>
  );
}