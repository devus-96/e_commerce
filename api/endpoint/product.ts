import { getRequest, paramsProps } from "../services";

export function useProduct (params:paramsProps, g_params?: paramsProps) {
    const p_product = getRequest('/api/public/products', g_params);
    const u_product = getRequest('/api/user/products', g_params);

    const subCategories = getRequest("/api/user/subcategories");
    const collections = getRequest("/api/user/collections");
    const tags = getRequest("/api/user/tags");
    const categories = getRequest("/api/user/categories");
    const images = getRequest("/api/user/images");
    const colors = getRequest("/api/user/colors");
    const stores = getRequest("/api/user/stores");
    const brands = getRequest("/api/user/brands");


    return {
        p_product,
        u_product
    }
}