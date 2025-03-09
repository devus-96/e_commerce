"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeValidationSchema } from "@/types/schemas";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storeStatus } from "@/constants";
import { TypeStoreModel } from "@/types/models";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/custom/Loading";
import { getStore, useStore } from "@/api/endpoint/store";
import { useRouter } from "next/navigation";

export default function Store({ _id }: { _id: string }) {
  const [isLoading, setLoading] = useState(false);
  const [store, setData] = useState<TypeStoreModel>();
  const router = useRouter();
  const {paramsRef, update, isUpdating} = useStore()
 
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      getStore({ _id: _id }).then((response) => {
        setData(response);
        form.reset(response);
        paramsRef.current = {_id: response._id}
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
  const form = useForm<z.infer<typeof storeValidationSchema>>({
    resolver: zodResolver(storeValidationSchema),
    defaultValues: {
      status: store && store.status,
      name: store && store.name,
      description: store && store.description,
      user_id: store && store.user_id,
    },
  });

  // 3. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof storeValidationSchema>) => {
    const data = {
      status: values.status,
      name: store && store.name,
      description: store && store.description,
      user_id: store && store.user_id,
    };

    await update(data);
  };

  return (
    <>
      {isLoading && <Loading loading={true} />}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap space-y-4 justify-between items-center">
          <Heading
            name={`Show - ${store?.name}`}
            description="View details about a store."
          />
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => router.back()}
              className="p-8 text-xl text-primary-600"
              variant="outline"
            >
              <ChevronLeft className="me-1" />
              Go back
            </Button>
            <Link
              href="/admin/stores"
              className="bg-black p-4 flex items-center gap-4 text-white rounded-md text-xl"
            >
              Go to list
              <ChevronRight className="me-1" />
            </Link>
          </div>
        </div>
        <Separator />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12 my-8">
            <div className="flex flex-col gap-4 col-span-2">
              <Card className="rounded-xl bg-white shadow-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="font-normal"> Basics info</CardTitle>
                </CardHeader>
                <CardContent className="p-10 flex flex-col gap-8">
                  <div className="flex justify-between">
                    <h6>Name:</h6> <span>{store?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <h6>Description:</h6> <span>{store?.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <h6>Products:</h6> <span>{store?.products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <h6>Orders:</h6> <span>{store?.orderitems.length}</span>
                  </div>

                  <div className="flex justify-between">
                    {/* <h6>Created At:</h6> <span>{store?.createdAt}</span> */}
                  </div>
                  <div className="flex justify-between">
                    <h6>Seller:</h6>
                    <Link className="text-muted font-bold " href="#">
                      {store?.user_id}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-4">
              <Card className="rounded-xl bg-white shadow-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="font-normal"> Logo</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <Image
                    src={(store && store.logo) || ""}
                    width="100"
                    height="100"
                    alt="logo"
                  />
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-white shadow-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="font-normal">Status*</CardTitle>
                </CardHeader>
                <CardContent className="py-10">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            disabled={isUpdating}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a status"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {storeStatus.map((item) => (
                                <SelectItem
                                  key={item.name}
                                  value={item.name}
                                  className="capitalize"
                                  title={item.description}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="flex gap-4 py-4 justify-center w-full">
                          <Info /> Hover an option in list to see more details
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <Button
            className="max-w-40 text-xl capitalize"
            variant="default"
            size="lg"
            disabled={isUpdating}
            type="submit"
          >
            update
          </Button>
        </form>
      </Form>
    </>
  );
}
