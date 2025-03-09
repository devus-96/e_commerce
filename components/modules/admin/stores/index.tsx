"use client";
import React, { useState } from "react";
import Content from "./Content";
import usePagination from "@/hooks/usePagination";
import { Pagination } from "@mui/material";
import Loading from "@/components/custom/Loading";
import { useStore } from "@/api/endpoint/store";

export default function Stores() {
  const { data, isLoading} = useStore()

  const [page, setPage] = useState(1);
  const PER_PAGE = 6;
  const count = Math.ceil(data ? data.length / PER_PAGE : 0);
  const _DATA = usePagination(data, PER_PAGE);

  const handleChange = (e: React.ChangeEvent<unknown>, p: number) => {
    setPage(p);
    _DATA.jump(p);
  };

  if (isLoading) return <Loading loading={true} />;
  return (
    <div className="flex flex-col gap-8">
      <Content stores={_DATA.currentData()} />

      <div className="flex w-full">
        <Pagination
          count={count}
          page={page}
          color="primary"
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
