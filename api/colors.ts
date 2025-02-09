import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { TypeColorModel } from "@/types/models";
import { useState } from "react";

export function useColors () {
    const [colors, setColors] = useState<TypeColorModel[]>([]);
    const [isFectchingColors, setFetchingColors] = useState<boolean>(false)
    const [ isPostingColors, setPostColors ] = useState<boolean>(false)
    const [colorsList, setColorsList] = useState<TypeColorModel[]>([]);

    const getColors = async () => {
          setFetchingColors(true);
          getHttpClient().get("/api/user/colors")
            .then((response) => {
              setColorsList(response.data.data);
            })
            .catch((error) => {
              toast({
                variant: 'default',
                title: 'OOps ❌',
                description: error.message,
              });
            })
            .finally(() => {
                setFetchingColors(false);
            });
    };

    const postColors = async (data: TypeColorModel) => {
        setPostColors(true)
        getHttpClient().post("/api/user/colors", data)
          .then((response)=>{
            setColors([...colors, response.data.data]);
          })
          .catch((error) => {
            toast({
                variant: 'default',
                title: 'OOps ❌',
                description: error.message,
              });
          })
          .finally(() => {
            setPostColors(false);
          })
    }

    return {
        getColors,
        postColors,
        colorsList,
        colors,
        isLoadingColors: isPostingColors || isFectchingColors
    }
}