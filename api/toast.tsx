import React from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import Link from "next/link";
import { AxiosError, AxiosResponse } from "axios";

export const handleError = (error: AxiosError) => {
    toast({
      variant: 'default',
      title: 'OOps ❌',
      description: error.message || 'An error occurred',
    });
};

export function handleSuccess(response: AxiosResponse, endpoint: string | undefined) {
    toast({
        variant: 'default',
        title: 'Well done ✔️',
        description: response.data.message,
        action: endpoint ? (
          <ToastAction altText={`Go to ${response.data.name?.substring(0, 50)}`}>
            <Link href={`${endpoint}/${response.data?._id}`}>Go to {response.data.name?.substring(0, 15)}</Link>
          </ToastAction>
        ) : undefined,
      });
}