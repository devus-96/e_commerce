import { getHttpClient } from "@/lib/http";
import { TypeStoreModel } from "@/types/models";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { DeleteRequestArgs, PutRequestArgs } from "@/types/mutations";
import { toast } from "@/hooks/use-toast";


export const storeServices = (storeId?: string | null) => {
    const [isFetchingStore, setFetchingStore] = useState(false);
    const [stores, setStore] = useState<TypeStoreModel>();
    const { userId } = useAuth();

    // Api call using use effect
  useEffect(() => {
    const getData = async () => {
      getHttpClient().get('/api/user/stores').then((res) => {
        setStore(res.data.data);
      })
      .catch((err) => {
        toast({
          variant: 'default',
          title: 'OOps ❌',
          description: err.message,
        });
      })
      .finally(() => {
        setFetchingStore(false)
      })
    };
    getData();
  }, [storeId, userId]);

  async function sendRequest(url: string, { arg }: { arg: PutRequestArgs }) {
    getHttpClient().put(url, arg.requestBody, {
      params: arg.queryParams
    }).then((response) => {
      const data = response.data;
        toast({
          variant: "default",
          title: "Well done ✔️",
          description: data.message,
        });
    })
    .catch((err) => {
      toast({
        variant: 'default',
        title: 'OOps ❌',
        description: err.message,
      });
    })
  }

  async function deleteResquest(url: string, { arg }: { arg: DeleteRequestArgs }) {
    getHttpClient().delete(url, {
      params: arg.queryParams
    }).then((response) => {
      const data = response.data;
        toast({
          variant: "default",
          title: "Well done ✔️",
          description: data.message,
        });
    })
    .catch((err) => {
      toast({
        variant: 'default',
        title: 'OOps ❌',
        description: err.message,
      });
    })
  }

  // 1. Set api mutation
  const { trigger: DeleteStore, isMutating: isDeleting } = useSWRMutation(
    "/api/user/stores",
    deleteResquest /* options */
  );

   // 1. Set api mutation
   const {
    trigger: updateStore,
    isMutating: isUpdating,
    error,
  } = useSWRMutation(
    "/api/user/stores",
    sendRequest /* options */
  );

  return {
    isFetchingStore,
    stores,
    updateStore,
    isUpdating,
    error,
    DeleteStore,
    isDeleting
  }
}