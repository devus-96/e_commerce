import { toast } from "@/hooks/use-toast";
import { TypeColorModel, TypeProductVariantModel, TypeSizeModel } from "@/types/models";
import { AxiosResponse } from "axios";

export function handleSucessProductResquest (
    response: AxiosResponse, 
    colors: TypeColorModel[], 
    sizes: TypeSizeModel[],
    activeVariant: boolean
) {
    if (response.data.success === false) {
        toast({
          variant: "default",
          title: "Upgrade to Pro!",
          description: response.data.message,
        });
      } else {
        const dataArray: TypeProductVariantModel[] = [];

        if (!activeVariant && colors.length > 0 && sizes.length > 0) {
          colors.forEach((color) => {
            sizes.forEach((size) => {
              const variant = {
                productId: response.data.data._id,
                name: color.slug + "|" + size.slug,
                color: color,
                colorImages: color.images,
                size: size,
                sizeImages: size.images,
                weight: response.data.data.weight,
                inventory: response.data.data.inventory,
                sku: response.data.data.sku,
                price: response.data.data.price,
                discount: response.data.data.discount,
                colorValue: response.data.color.value,
                status: response.data.data.status,
              };
              dataArray.push(variant);
            });
          });
        } else if (
          !activeVariant &&
          colors.length > 0 &&
          sizes.length === 0
        ) {
          colors.forEach((color) => {
            const variant = {
              productId: response.data.data._id,
              name: color.slug,
              color: color,
              colorImages: color.images,
              weight: response.data.data.weight,
              inventory: response.data.data.inventory,
              sku: response.data.data.sku,
              price: response.data.data.price,
              discount: response.data.data.discount,
              colorValue: color.value,
              status: response.data.data.status,
            };
            dataArray.push(variant);
          });
        }
    }
}

