"use client";
import Row from "@/components/custom/Row";
import { Button } from "@/components/ui/button";
import { subscriptionPlan } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TypeSubscriptionModel } from "@/types/models";
import { useAuth } from "@clerk/nextjs";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutValidationSchema } from "@/types/schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TypeSubscriptionPlan } from "@/types";
import Loading from "@/components/custom/Loading";
import { getUserSubscription, useSubscriptions } from "@/api/endpoint/subscription";

export default function Pricing() {
  const { userId } = useAuth();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<TypeSubscriptionModel>();
  const {createSubcription, isCreatingSubscription} = useSubscriptions()

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      getUserSubscription({user_id: userId})
        .then((response) => {
          setSubscription(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getData();
  }, []);

  // 2. Define your validation.
  const form = useForm<z.infer<typeof checkoutValidationSchema>>({
    resolver: zodResolver(checkoutValidationSchema),
    defaultValues: {
      user_id: userId ? userId : "",
      amount: subscriptionPlan[1].price,
    },
  });

  // 3. Define a submit handler.
  const onSubmit = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    if (subscription?.type === "pro" && subscription.status === "active") {
      toast({
        variant: "default",
        title: "Already subscribed",
        description: "You have an active subscription",
      });
      return;
    }

    const data = {
      user_id: userId ? userId : "",
      amount: subscriptionPlan[1].price,
    };
    await createSubcription(data);
  };

  return (
    <>
      {isLoading && <Loading loading={true} />}
      <div className="w-full flex flex-col gap-4 justify-center items-center py-10">
        <h3>Pricing plans </h3>
        <h6>
          From free plan to complete premium plan, grow rapidly your store.
          Simple pricing, no hidden fees.
        </h6>

        <Row className="flex-wrap lg:flex-nowrap lg:gap-x-4">
          {subscriptionPlan.map((item: TypeSubscriptionPlan, idx: number) => (
            <div className="flex flex-wrap gap-4 mt-20" key={idx}>
              <div className="flex flex-col gap-8 border border-border p-8 rounded-lg min-w-[360px]">
                <div className="flex flex-col gap-8 mb-10">
                  <h5 className="capitalize">{item.type}</h5>
                  <p className="text-xl text-heading">{item.description}</p>
                </div>
                <div className="flex items-center gap-8">
                  <h2>${item.price}</h2>
                  <strong>/{item.period}</strong>
                </div>
                <div className="flex flex-col gap-8 mt-8 ">
                  {item.roles.map(
                    (role: { title: string; active: boolean }, idx: number) => (
                      <div className="flex gap-12" key={idx}>
                        <Check
                          className={cn(
                            "",
                            role.active
                              ? "text-black dark:text-white"
                              : "text-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xl",
                            !role.active && "line-through text-heading"
                          )}
                        >
                          {role.title}
                        </span>
                      </div>
                    )
                  )}

                  <div className="mt-auto">
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8 w-full"
                    >
                      <Button
                        type="submit"
                        variant="default"
                        className={cn(
                          "capitalize w-full",
                          subscription?.type === item.type &&
                            "bg-white text-black border border-border hover:text-white"
                        )}
                        disabled={
                          isCreatingSubscription ||
                          isLoading ||
                          subscription?.type === item.type
                        }
                      >
                        {subscription?.type === item.type
                          ? "current plan"
                          : "Buy now"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Row>
      </div>
    </>
  );
}
