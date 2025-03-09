"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/components/custom/Loading";
import { useBrand } from "@/api/endpoint/brand";

export default function Brands() {
  const {data, isLoading} = useBrand()

  if (isLoading) return <Loading loading={true} />;
  return (
    <DataTable searchKey="name" columns={columns} data={data ? data : []} />
  );
}
