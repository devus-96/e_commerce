import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { TypeSubCategoryModel } from "@/types/models";
import { useState } from "react";

export function useCategories () {
    const [categories, setCategories] =useState<TypeSubCategoryModel[]>();
    const [isFectchingCategories, setFectchingCategories] = useState(false)

    const getCategories = async () => {
        setFectchingCategories(true);
          getHttpClient().get("/api/user/categories")
            .then((response) => {
                setCategories(response.data.data);
            })
            .catch((error) => {
                toast({
                    variant: 'default',
                    title: 'OOps ❌',
                    description: error.message,
                  });
            })
            .finally(() => {
                setFectchingCategories(false);
            });
        };
    
        return {
            isFectchingCategories,
            categories,
            getCategories
        }
}