"use client";
import React from "react";
import { columns, Slide } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/components/custom/Loading";
import { useSlide } from "@/api/endpoint/slides";

export default function Slides() {
  const { data, isLoading } = useSlide<Slide>()
  
  if (isLoading) return <Loading loading={true} />;

  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data ? data : []} />
    </>
  );
}
