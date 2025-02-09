import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { TypeCollectionModel } from "@/types/models";
import { useState } from "react";

export function useCollections () {
    const [collectionsList, setCollections] =useState<TypeCollectionModel[]>();
    const [isFectchingCollections, setFectchingCollections] = useState(false)

    const getCollections = async () => {
        setFectchingCollections(true);
          getHttpClient().get("/api/user/collections")
            .then((response) => {
                setCollections(response.data.data);
            })
            .catch((error) => {
                toast({
                    variant: 'default',
                    title: 'OOps ❌',
                    description: error.message,
                  });
            })
            .finally(() => {
                setFectchingCollections(false);
            });
        };
    
        return {
            isFectchingCollections,
            collectionsList,
            getCollections
        }
}