"use client";
import React, { useState } from "react";
import usePagination from "@/hooks/usePagination";
import { Pagination } from "@mui/material";
import Content from "./Content";
import Loading from "@/components/custom/Loading";
import { useCampaigns } from "@/api/endpoint/campaign";

export default function Campaigns({ storeId }: { storeId: string }) {
  const {data, isLoading} = useCampaigns({ storeId: storeId })
  
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;
  const count = Math.ceil(data ? data.length / PER_PAGE : 1);
  const _DATA = usePagination(data, PER_PAGE);

  const handleChange = (e: React.ChangeEvent<unknown>, p: number) => {
    setPage(p);
    _DATA.jump(p);
  };

  if (isLoading) return <Loading loading={true} />;

  return (
    <div className="flex flex-col gap-8">
      <Content data={_DATA.currentData()} storeId={storeId} />

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
