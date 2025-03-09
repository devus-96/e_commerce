import { HttpClient } from "../httpClient";
import { paramsProps } from "../services";
import { handleError } from "../toast";

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

export function useProduct (params:paramsProps) {

    
}