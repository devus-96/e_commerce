"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import Loading from "@/components/custom/Loading";
import useSWR, { Fetcher } from "swr";
import { useAuth } from "@clerk/nextjs";
import { useSubscriptions } from "@/api/endpoint/subscription";

export default function Subscriptions() {
  const { data, isLoading} = useSubscriptions()

  if (isLoading) return <Loading loading={true} />;

  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data ? data : []} />
    </>
  );
}
