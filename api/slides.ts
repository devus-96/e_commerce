import { toast } from "@/hooks/use-toast";
import { getHttpClient } from "@/lib/http";
import { TypeSlideModel } from "@/types/models";
import { useState } from "react";

export const fetchSlide = () => {
    const [slides, setSlides] = useState<TypeSlideModel[]>();
    const [isFetchingSlides, setFEtchingSlides] = useState(false)

    function  getSlides () {
        setFEtchingSlides(true)
        getHttpClient().get("/api/public/slides",).then((response) => {
            setSlides(response.data.data)
        })
        .catch((err) => {
            toast({
                variant: 'default',
                title: 'OOps ❌',
                description: err.message,
              });
        })
        .finally(() => {
            setFEtchingSlides(false)
        })
    }

    return {
        slides,
        getSlides,
        isFetchingSlides
    }
};