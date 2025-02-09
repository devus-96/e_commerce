import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { TypeTagModel } from "@/types/models";
import { useState } from "react";

export function useTags () {
    const [tagsList, setTags] =useState<TypeTagModel[]>();
    const [isFectchingTags, setFectchingTags] = useState(false)

    const getTags = async () => {
        setFectchingTags(true);
          getHttpClient().get("/api/user/tags")
            .then((response) => {
                setTags(response.data.data);
            })
            .catch((error) => {
                toast({
                    variant: 'default',
                    title: 'OOps ❌',
                    description: error.message,
                  });
            })
            .finally(() => {
                setFectchingTags(false);
            });
        };
    
        return {
            isFectchingTags,
            tagsList,
            getTags
        }
}