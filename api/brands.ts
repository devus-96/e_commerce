import { getHttpClient } from "@/lib/http";
import { useState } from "react";

export function useBrands () {
    const [brands, setBrands] = useState<string | undefined>("");
    const [isFectchingBrand, setFectchingBrand] = useState(false)

    const getBrands = async () => {
        setFectchingBrand(true);
          getHttpClient().get("/api/user/brands")
            .then((response) => {
              setBrands(response.data.data);
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
                setFectchingBrand(false);
            });
        };
    
        return {
            isFectchingBrand,
            brands,
            getBrands
        }
}