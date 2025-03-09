"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/components/custom/Loading";
import { use_admin_shipping } from "@/api/endpoint/admin_shippings";

export default function Shippings() {
  const { data, isLoading} = use_admin_shipping()
 
  if (isLoading) return <Loading loading={true} />;

  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data ? data : []} />;
    </>
  );
}
