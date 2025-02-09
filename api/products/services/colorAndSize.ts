import { TypeColorModel, TypeSizeModel } from "@/types/models";

export function extractColorAndSize (productVariants: any[], colors:TypeColorModel[] , sizes: TypeSizeModel[]) {
    for (
        let index = 0;
        index < productVariants.length;
        index++
      ) {
        const variant = productVariants[index];

        //fill colors
        const tempColor = {
          ...variant.color,
          images: variant.colorImages,
          value: variant.colorValue,
        };
        if (!colors.find((item) => item._id === tempColor._id)) {
          colors.push(tempColor);
        }

        //fill sizes
        const tempSize = {
          ...variant.size,
          images: variant.sizeImages,
        };
        if (!sizes.find((item) => item._id === tempSize._id)) {
          if (tempSize.size) {
            sizes.push(tempSize);
          }
        }
      }
}