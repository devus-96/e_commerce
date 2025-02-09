import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { TypeSizeModel } from "@/types/models";
import { useState } from "react";

export function useSizes () {
  const [sizesList, setSizesList] = useState<TypeSizeModel[]>([]);
    const [sizes, setSizes] = useState<TypeSizeModel[]>([]);
    const [isFectchingSizes, setFetchingSizes] = useState<boolean>(false)
    const [ isPostingSizes, setPostSizes ] = useState<boolean>(false)

    const getSizes = async () => {
        setFetchingSizes(true);
          getHttpClient().get("/api/user/sizes")
            .then((response) => {
                setSizesList(response.data.data);
            })
            .catch((error) => {
                toast({
                    variant: 'default',
                    title: 'OOps ❌',
                    description: error.message,
                  });
            })
            .finally(() => {
                setFetchingSizes(false);
            });
    };

    const postSizes = async (data: TypeSizeModel) => {
        setPostSizes(true)
        getHttpClient().post("/api/user/sizes", data)
          .then((response)=>{
            setSizes([...sizes, response.data.data]);
          })
          .catch((error) => {
            toast({
                variant: 'default',
                title: 'OOps ❌',
                description: error.message,
              });
          })
          .finally(() => {
            setPostSizes(false);
          })
    }

    return {
        getSizes,
        postSizes,
        sizesList,
        sizes,
        isLoadingSizes: isPostingSizes || isFectchingSizes
    }
}