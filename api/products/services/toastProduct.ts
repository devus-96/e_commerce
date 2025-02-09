import { toast } from "@/hooks/use-toast";
import { TypeColorModel, TypeProductVariantModel, TypeSizeModel } from "@/types/models";

export function ToastProduct (response: any, activeVariant: boolean, colors: TypeColorModel[], sizes: TypeSizeModel[]) {
    const data = response.data;
    if (data.success === false) {
        toast({
          variant: "default",
          title: "Upgrade to Pro!",
          description: data.message,
        });
        return null
      } else {
        let dataArray: TypeProductVariantModel[] = [];

        if (!activeVariant && colors.length > 0 && sizes.length > 0) {
            dataArray = Toast1(response.data, colors, sizes)
        } else if (
          !activeVariant &&
          colors.length > 0 &&
          sizes.length === 0
        ) {
            dataArray = Toast2(response.data, colors)
        }
        return dataArray
      }
    }

export function Toast1 (data: any, colors: TypeColorModel[], sizes: TypeSizeModel[]) {
        const dataArray: TypeProductVariantModel[] = [];
        // create new variation
        colors.forEach((color) => {
            sizes.forEach((size) => {
            const variant = {
                productId: data.data._id,
                name: color.slug + "|" + size.slug,
                color: color,
                colorImages: color.images,
                size: size,
                sizeImages: size.images,
                weight: data.data.weight,
                inventory: data.data.inventory,
                sku: data.data.sku,
                price: data.data.price,
                discount: data.data.discount,
                colorValue: color.value,
                status: data.data.status,
            };
            dataArray.push(variant);
            });
        });

        return dataArray
}

export function Toast2 (data: any, colors: TypeColorModel[]) {
    const dataArray: TypeProductVariantModel[] = [];
    // create new variation
    colors.forEach((color) => {
        const variant = {
          productId: data.data._id,
          name: color.slug,
          color: color,
          colorImages: color.images,
          weight: data.data.weight,
          inventory: data.data.inventory,
          sku: data.data.sku,
          price: data.data.price,
          discount: data.data.discount,
          colorValue: color.value,
          status: data.data.status,
        };
        dataArray.push(variant);
      });

    return dataArray
}