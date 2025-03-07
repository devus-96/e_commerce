"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, Trash } from "lucide-react";
import { Alert } from "@/components/custom/Alert";
import { TypeStoreModel } from "@/types/models";
import { useStore } from "@/api/endpoint/store";
import { useUser } from "@/api/endpoint/user";

export default function DeleteStore({
  data,
  check,
}: {
  data: TypeStoreModel;
  check: boolean;
}) {
  // 1. Hooks
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const {DeleteStore, isDeleting} = useStore();
  const {SwitchAccount, isSwitching } = useUser()


  // Define a submit handler.
  const onDelete = async () => {
    await DeleteStore({
      queryParams: { storeId: data._id },
    });
  };

  // Define a submit handler.
  const onSwitchToAdmin = async () => {
    await SwitchAccount({
      queryParams: { userId: data.user_id, role: check ? "user" : "admin" },
    });
  };

  console.log(check);
  return (
    <div className="grid grid-cols-1 grid-rows-2 gap-4">
      <Card className="min-w-[360px] flex justify-between items-center">
        <CardHeader className="!h-fit">
          <CardTitle>Delete</CardTitle>
          <CardDescription>Move your store to trash</CardDescription>
        </CardHeader>
        <CardContent className="grid place-content-center">
          <Button
            disabled={isDeleting}
            variant="danger"
            size="icon"
            onClick={() => setOpenAlert(!openAlert)}
          >
            <Trash className="text-white" />
          </Button>
        </CardContent>
      </Card>

      <Card className="min-w-[360px] flex justify-between items-center">
        <CardHeader className="!h-fit">
          <CardTitle>Switch my account</CardTitle>
          <CardDescription className="text-red-600">
            Make sure to sign out and sign in again to see effect.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid place-content-center">
          <Button
            disabled={isDeleting}
            variant="default"
            size="icon"
            onClick={() => setOpenAlert(!openAlert)}
          >
            <Shuffle className="text-white" />
          </Button>
        </CardContent>
      </Card>

      <Alert
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />

      <Alert
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        onConfirm={onSwitchToAdmin}
        isDeleting={isSwitching}
      />
    </div>
  );
}
