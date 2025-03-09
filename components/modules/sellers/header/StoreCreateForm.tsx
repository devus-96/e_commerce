"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { storeValidationSchema } from "@/types/schemas";
import { z } from "zod";
import { useAuth } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/components/custom/Loading";
import React from "react";
import { useStore } from "@/api/endpoint/store";

export function StoreCreateForm() {
  const { userId} = useAuth();
  const {trigger, isMutating, err} = useStore()

  // 2. Define your validation.
  const form = useForm<z.infer<typeof storeValidationSchema>>({
    resolver: zodResolver(storeValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      user_id: "",
    },
  });

  // 3. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof storeValidationSchema>) => {
    const data = {
      name: values.name,
      description: values.description,
      user_id: userId,
    };
    await trigger(data /* options */);
  };

  if (isMutating) return <Loading loading={true} />;
  return (
    // 4. Define a form
    <Form {...form}>
      {err && err}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  mt-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="amazone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Put your description here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isMutating} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
