"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/components/custom/Loading";
import { useWithdrawals } from "@/api/endpoint/withDrawals";

export default function Withdrawals({ store }: { store: string }) {
  // fecthing client
  const {data, isLoading} = useWithdrawals({ store: store })

  if (isLoading) return <Loading loading={true} />;

  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data ? data : []} />;
    </>
  );
}
