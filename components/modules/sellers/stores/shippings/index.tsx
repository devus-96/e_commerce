"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/components/custom/Loading";
import { use_user_shipping } from "@/api/endpoint/u_shippings";

export default function Shippings({ store }: { store: string }) {
  const {data, isLoading} = use_user_shipping({ store: store })
  
  if (isLoading) return <Loading loading={true} />;

  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data ? data : []} />;
    </>
  );
}
