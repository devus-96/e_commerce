"use client";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Informations from "./Informations";
import Preferences from "./Preferences";
import { TypeStoreModel } from "@/types/models";
import Loading from "@/components/custom/Loading";
import { useAuth } from "@clerk/nextjs";
import { get_user_Store } from "@/api/endpoint/store";

export default function Settings({
  storeId,
  check,
}: {
  storeId: string | null;
  check: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TypeStoreModel>();
  const { userId } = useAuth();

  // Api call using use effect
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      get_user_Store({ storeId: storeId, userId: userId }).then((response) => {
        setData(response.data.data);
      }).finally(() => {
        setLoading(false);
      });
    };
    getData();
  }, [storeId, userId]);
  return (
    <>
      {loading && <Loading loading={true} />}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading name="Settings" description="Customize your store" />
          <Separator />
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Informations</TabsTrigger>
            <TabsTrigger value="password">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent
            value="account"
            className="w-full grid grid-cols-1  lg:grid-cols-4 gap-4"
          >
            {data && <Informations data={data} check={check} />}
          </TabsContent>
          <TabsContent value="password">
            <Preferences />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
