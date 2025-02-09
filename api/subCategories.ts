import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { TypeSubCategoryModel } from "@/types/models";
import { useState } from "react";

export function useSubCategories () {
    const [subCategoriesList, setSubCategoriesList] =useState<TypeSubCategoryModel[]>();
    const [isFectchingsubCategoriesList, setFectchingsubCategoriesList] = useState(false)

    const getSubCategoriesList = async () => {
        setFectchingsubCategoriesList(true);
          getHttpClient().get("/api/user/subcategories")
            .then((response) => {
                setSubCategoriesList(response.data.data);
            })
            .catch((error) => {
                toast({
                    variant: 'default',
                    title: 'OOps ❌',
                    description: error.message,
                  });
            })
            .finally(() => {
                setFectchingsubCategoriesList(false);
            });
        };
    
        return {
            isFectchingsubCategoriesList,
            subCategoriesList,
            getSubCategoriesList
        }
}