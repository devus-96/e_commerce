import { toast } from "@/hooks/use-toast";
import { HttpClient } from "../httpClient";
import { delRequest, fetcher, paramsProps, postRequest, putRequest } from "../services";
import { handleError, handleSuccess } from "../toast";
import { ProductFormData } from "@/types/forms";
import { handleSucessProductResquest } from "../productServices";
import { TypeColorModel, TypeProductVariantModel, TypeSizeModel } from "@/types/models";
import { useRef } from "react";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { Product } from "@/components/modules/sellers/stores/products/columns";

type imageProps = {
  url: string;
  store: string;
  user_id: string | null | undefined;
}

export async function get_public_product (params?: paramsProps) {
return await HttpClient()
  .get("/api/public/products", {
    params: params ? params : undefined,
  })
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    handleError(error);
  })
};

export async function get_user_product (params?: paramsProps) {
    return await HttpClient()
      .get("/api/user/products", {
        params: params ? params : undefined,
      })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        handleError(error);
      })
    };
  
export const getImages = async (params?: paramsProps) => {
      return await HttpClient()
        .get("/api/user/images",{
          params: params ? params : undefined,
        })
        .then((response) => {return response.data.data;})
        .catch((error) => {
          handleError(error);
        })
    };

export const getColors = async (params?: paramsProps) => {
  return await HttpClient()
    .get("/api/user/colors",{
      params: params ? params : undefined,
    })
    .then((response) => {return response.data.data;})
    .catch((error) => {
      handleError(error);
    })
};

export const getSizes = async (params?: paramsProps) => {
  return await HttpClient()
    .get("/api/user/sizes",{
      params: params ? params : undefined,
    })
    .then((response) => {return response.data.data;})
    .catch((error) => {
      handleError(error);
    })
};

export function postProductVariants (storeId: string | undefined) {
  HttpClient().post("/api/user/productvariants").then((response) => {
    handleSuccess(response.data, `/stores/${storeId}/products`)
  }).catch((error) => {
    console.log(error);
  })
  .catch((err) => {
    toast({
      variant: "default",
      title: "OOps ❌",
      description: err.message,
    });
    console.log(err.message);
  })
  .finally(() => {});
}

export async function postColors (data: TypeColorModel) {
  const response = await HttpClient().post("/api/user/colors", data)
  return response
}

export async function postSizes (data: TypeSizeModel) {
  const response = await HttpClient().post("/api/user/sizes", data)
  return response
}

export async function postImages (data: imageProps) {
  const response = await HttpClient().post("/api/user/images", data)
  return response
}


export async function postProduct (url: string, colors: TypeColorModel[] , sizes:TypeSizeModel[] , activeVariant:boolean , { arg }: { arg: ProductFormData }) {
  HttpClient().post(url, {arg}).then((response) => {
    handleSucessProductResquest(response, colors, sizes, activeVariant)
  })
  .catch((err) => {
    toast({
      variant: "default",
      title: "OOps ❌",
      description: err.message,
    });
    console.log(err.message);
  })
  .finally(() => {});
}

export function useProduct (params?:paramsProps, storeId?: string | undefined) {
  const colorRef = useRef<TypeColorModel[]>([])
  const sizeRef = useRef<TypeSizeModel[]>([])
  const activeVariantRef = useRef<boolean>(false)
  const paramsRef = useRef<paramsProps | undefined>(undefined)

  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/user/products",
    (url, {arg}: {arg: ProductFormData}) => postProduct(url, colorRef.current, sizeRef.current, activeVariantRef.current, {arg}).then(() => {
      postProductVariants(storeId)
    })
  );

  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/admin/brands",
    (url, { arg }: {arg: ProductFormData}) => putRequest<ProductFormData>(url, paramsRef.current , { arg }, `/admin/brands`).then((response) => {
      const data = response.data;
      if (data.success === false) {
        toast({
            variant: "default",
            title: "Oops, error",
            description: data.message,
        });
      } else {
        delRequest("/api/user/productvariants", {productId: data.data._id}).then((response) => {
          const data_pv = response.data;
          if (data_pv) {
            // create new variation
            const dataArray: TypeProductVariantModel[] = [];
            if (!activeVariantRef.current && sizeRef.current.length > 0 && colorRef.current.length > 0) {
              colorRef.current.forEach((color) => {
                sizeRef.current.forEach((size) => {
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
              })
              postRequest<TypeProductVariantModel[]>("/api/user/productvariants", {arg: dataArray}, `/stores/${storeId}/products`)
            }else if (
              !activeVariantRef.current &&
              colorRef.current.length > 0 &&
              sizeRef.current.length === 0
            ) {
              colorRef.current.forEach((color) => {
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
              postRequest<TypeProductVariantModel[]>("/api/user/productvariants", {arg: dataArray}, `/stores/${storeId}/products`)
            }
        } 
        }).catch((err) => {
          toast({
            variant: "default",
            title: "OOps ❌",
            description: err.message,
          });
          console.log(err.message);
        })
      }
    })
  );

  const { data, isLoading } = useSWR<Product[]>(
    "/brands",
    fetcher<Product>(params)
  );


  return {
    paramsRef,
    update,
    isUpdating,
    colorRef,
    sizeRef,
    activeVariantRef,
    create,
    isCreating,
    data,
    isLoading
  }
}