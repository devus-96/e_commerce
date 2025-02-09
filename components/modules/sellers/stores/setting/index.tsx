"use client";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Informations from "./Informations";
import Preferences from "./Preferences";
import Loading from "@/components/custom/Loading";
import { storeServices } from "@/api/storeService"; 

export default function Settings({
  storeId,
  check,
}: {
  storeId: string | null;
  check: boolean;
}) {
    const { stores, isFetchingStore } = storeServices(storeId)

  return (
    <>
      {isFetchingStore && <Loading loading={true} />}
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
            {stores && <Informations data={stores} check={check} />}
          </TabsContent>
          <TabsContent value="password">
            <Preferences />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}