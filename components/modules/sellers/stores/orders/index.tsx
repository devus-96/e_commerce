"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/components/custom/Loading";
import { useOrder } from "@/api/endpoint/order";

export default function Orders({ storeId }: { storeId: string }) {
  const {data, isLoading} = useOrder({ storeId: storeId })
  
  if (isLoading) return <Loading loading={true} />;
  return (
    <DataTable searchKey="name" columns={columns} data={data ? data : []} />
  );
}
