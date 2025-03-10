"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/components/custom/Loading";
import { useProduct } from "@/api/endpoint/product";

export default function Products({ storeId }: { storeId: string }) {
  const { data, isLoading} = useProduct({ storeId: storeId })

  if (isLoading) return <Loading loading={true} />;
  return (
    <DataTable searchKey="name" columns={columns} data={data ? data : []} />
  );
}
