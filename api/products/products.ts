import { ProductFormData } from "@/types/forms";
import { create } from "zustand";
import { initRessources, ResourceState } from "../ressources";

interface Products extends ResourceState<ProductFormData> {}

export const useProduct = create<Products>((set) => ({
    ...initRessources(`${process.env.NEXT_PUBLIC_API_URL}/api/user/products`, set)
}))