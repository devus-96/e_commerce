"use client";
import React from "react";
import { Collection, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import useSWR, { Fetcher } from "swr";
import axios from "axios";
import Loading from "@/components/custom/Loading";
import { useAuth } from "@clerk/nextjs";
import { useCollection } from "@/api/endpoint/collection";

export default function Collections() {
  const { getToken } = useAuth();
  const {data, isLoading} = useCollection();

  if (isLoading) return <Loading loading={true} />;

  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data ? data : []} />;
    </>
  );
}
