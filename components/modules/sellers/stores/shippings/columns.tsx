"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";
import React from 'react';

export type Shipping = {
  _id: string;
  name: string;
  image: string;
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<Shipping>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image src={row.original.image} alt="image" width="30" height="30" />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const formatted = format(row.getValue("createdAt"), "MMMM do, yyyy");
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];