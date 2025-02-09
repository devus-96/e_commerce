import { ProductFormData } from "@/types/forms";
import { productValidationSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSWRMutation from "swr/mutation";
import {
    Image as TypeImage,
    TypeBrandModel,
    TypeCategoryModel,
    TypeColorModel,
    TypeProductVariantModel,
    TypeSizeModel,
    TypeSubCategoryModel,
    TypeStoreModel,
    TypeCollectionModel,
    TypeTagModel,
  } from "@/types/models";
import { getHttpClient } from "@/lib/http";
import { extractColorAndSize } from "./services/colorAndSize";
import { Toast1, Toast2, ToastProduct } from "./services/toastProduct";
import { toast } from "@/hooks/use-toast";
import { nameFormat } from "@/lib/regex";
import { useAuth } from "@clerk/nextjs";
import { slugString } from "@/lib/helpers";
import { useCategories } from "../categories";
import { useBrands } from "../brands";
import { useCollections } from "../collections";
import { useColors } from "../colors";
import { useSizes } from "../sizes";
import { useSubCategories } from "../subCategories";
import { useTags } from "../tags";
import { storeServices } from "../storeService";
import { ToastSucess } from "@/lib/toastSuccess";

export const productServives = (
  id: string | undefined,  
  storeId: string
) => {
    const { userId } = useAuth();
    const {stores} = storeServices(storeId)
    const { categories, getCategories} = useCategories()
    const { brands, getBrands} = useBrands()
    const { collectionsList, getCollections} = useCollections()
    const { getColors, colorsList } = useColors()
    const { getSizes, sizesList } = useSizes()
    const { subCategoriesList, getSubCategoriesList} = useSubCategories()
    const { tagsList, getTags} = useTags()

    const [images, setImages] = useState<TypeImage[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [product, setProduct] = useState<ProductFormData>();
    const [colors, setColors] = useState<TypeColorModel[]>([]);
    const [sizes, setSizes] = useState<TypeSizeModel[]>([]);
    const [activeOption, setActiveOption] = useState<string>("");
    const [activeVariant, setActiveVariant] = useState<boolean>(false);
    const [optionItem, setOptionItem] = useState<string>("");
    const [activeOptionItem, setActiveOptionItem] = useState<TypeColorModel>();
    const [category, setCategory] = useState<string>("");
    const [brand, setBrand] = useState<string | undefined>(product?.brand);
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [collections, setCollections] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

      
    async function postRequest(url: string, { arg }: { arg: ProductFormData }) {
      getHttpClient().post(url, arg).then((res) => {
        let arr = ToastProduct(res, activeVariant, colors, sizes)
        if (arr !== null) {
          getHttpClient().post(url, arr).then((res) => {
            ToastSucess(res, storeId, `/product/${storeId}/campaigns/${res.data._id}`)
          })
          .catch((err) => {
            toast({
            variant: 'default',
            title: 'OOps ❌',
            description: err.message,
          });
          })
        }
      })
    }

    async function putRequest (url: string, { arg }: { arg: ProductFormData }) {
      getHttpClient().put(url).then((res) => {
        const data = res.data
        if (res.status === 0) {
          toast({
            variant: "default",
            title: "Oops, error",
            description: res.data.message,
          });
        } else {
          getHttpClient().delete('/api/user/productvariants', {
            params: res.data.data._id
          }).then((res) => {
            const data_pv = res.data;
            let dataArray: TypeProductVariantModel[] = [];
            if (data_pv.success === true) {
              if (!activeVariant && colors.length > 0 && sizes.length > 0) {
                dataArray = Toast1(data, colors, sizes)
                getHttpClient().post('/api/user/productvariants', dataArray).then((res) => {
                  ToastSucess(res, storeId, `/product/${storeId}/campaigns/${res.data._id}`)
                })
              }
            } else if(!activeVariant &&
              colors.length > 0 &&
              sizes.length === 0) {
                dataArray = Toast2(data, colors)
                getHttpClient().post('/api/user/productvariants', dataArray).then((res) => {
                  ToastSucess(res, storeId, `/product/${storeId}/campaigns/${res.data._id}`)
                })
            }
          })
        }
      })
    }

    // 3. Set Form mutation
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/user/products",
    postRequest /* options */
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/user/products",
    putRequest /* options */
  );

  // 4. Define your validation and default values.
  const form = useForm<z.infer<typeof productValidationSchema>>({
    resolver: zodResolver(productValidationSchema),
    defaultValues: product
      ? product
      : {
          category: categories && categories[0] && categories[0]._id,
          name: "",
          description: "A simple description for create",
          additionnal: "A simple additionnal for create",
          specification: "A simple specification for create",
          slug: "",
          images: images,
          status: "draft",
          discount: 0,
          price: 0,
        },
  });

  // 4.1. Fetching data
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      getHttpClient().get("/api/user/products", {
        params: { _id: id }
      })
        .then((response) => {
          setProduct(response.data.data);
          setCategory(response.data.data.category);
          setBrand(response.data.data.brand);
          setSubCategories(response.data.data.subCategories);
          setCollections(response.data.data.collections);
          setTags(response.data.data.tags);
          // setProductVariants(response.data.data.productVariants);
          setImages(response.data.data.images);

          form.reset(response.data.data);

          extractColorAndSize(response.data.data.productVariants, colors, sizes)
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getCategories();
    getColors();
    getSizes();
    if (id) {
      getProduct();
    }
    getSubCategoriesList();
    getBrands();
    getCollections();
    getTags();
  }, [form]);

      // 8. Add option item
  const handleAddOptionItem = async (event: React.KeyboardEvent) => {
    setLoading(true);
    if (event.key === "Enter") {
      //check option active and add value
      if (activeOption === "" || optionItem == "") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Select an option first and fill choice",
        });
        return;
      }

      if (!optionItem.match(nameFormat)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invald format value",
        });
        return;
      }

      if (activeOption === "color") {
        const data: TypeColorModel = {
          name: optionItem,
          description: "simple description you should clean",
          slug: slugString(optionItem),
          images: [],
          user_id: userId ? userId : "",
          value: "",
          store: stores,
          status: "publish",
        };
        if (colors.length > 10) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Max length reached",
          });
          return;
        }
        if (colors.find((item: TypeColorModel) => item.slug === data.slug)) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "This color already exist.",
          });
          return;
        }

        getHttpClient().post("/api/user/colors", data)
          .then((response)=>{
            setColors([...colors, response.data.data]);
          })
          .catch((error) => {

          })
          .finally(() => {
            setLoading(false);
          })

        }
        if (activeOption === "size") {
          const data: TypeSizeModel = {
            name: optionItem,
            description: "simple description you should clean",
            slug: slugString(optionItem),
            images: [],
            user_id: userId,
            value: "",
            store: stores,
            status: "publish",
          };
  
          if (sizes.length > 10) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Max length reached",
            });
          }
          if (sizes.find((item: TypeSizeModel) => item.slug === data.slug)) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "This size already exist.",
            });
            return;
          }

          getHttpClient().post('/api/user/sizes', data).then((response) => {
            setSizes([...sizes, response.data.data]);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
        }
        setOptionItem("");
        setLoading(false);
      }
    }

     const handleRemoveOptionItem = (slug: string) => {
        if (activeOption === "color") {
          setColors(
            colors.filter((current: TypeColorModel) => current.slug !== slug)
          );
    
          return;
        }
        if (activeOption === "size") {
              setSizes(sizes.filter((current: TypeSizeModel) => current.slug !== slug));
              return;
        }

        //update
        setColors(
          colors.filter((current: TypeColorModel) => current.slug !== slug)
        );
        setSizes(sizes.filter((current: TypeSizeModel) => current.slug !== slug));      
     }

     const handleEditColor = (e: React.ChangeEvent<HTMLInputElement>) => {
         const val = e.currentTarget.value;
         const newColors = colors.filter((item: TypeColorModel) =>
           activeOptionItem?.slug === item.slug ? (item.value = val) : item
         );
         setColors(newColors);
    };
    const handleAddImage = (url: string, type: string) => {
        if (type === "color") {
          const newColors = colors.filter((item: TypeColorModel) =>
            activeOptionItem?.slug == item.slug
              ? item.images.find((val: TypeImage) => val.url === url)
                ? ""
                : item.images.push({ url: url })
              : item
          );
          setColors(newColors);
        }
    
        if (type === "size") {
          const newSizes = sizes.filter((item: TypeSizeModel) =>
            activeOptionItem?.slug == item.slug
              ? item.images.find((val: TypeImage) => val.url === url)
                ? ""
                : item.images.push({ url: url })
              : item
          );
          setSizes(newSizes);
        }
      };
      const handleAddItemSelected = (slug: string) => {
          if (activeOption === "color") {
            const data = colorsList.find((color) => color.slug === slug);
            if (data) {
              if (colors.find((color) => color.slug === data.slug)) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "This color already exist.",
                });
                return;
              }
              setColors([...colors, data]);
            }
          }
          if (activeOption === "size") {
            const data = sizesList.find((size) => size.slug === slug);
            if (data) {
              if (sizes.find((size) => size.slug === data.slug)) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "This size already exist.",
                });
                return;
              }
              setSizes([...sizes, data]);
            }
          }
    };

    const handleDeleteAllImage = () => {
        const newColors = colors.filter((item: TypeColorModel) =>
          activeOptionItem?.slug === item.slug ? (item.images = []) : item
        );
        setColors(newColors);
    };

    const handleSaveImage = async (url: string) => {
      setLoading(true);
      // setImages([...images, { url }]);
      images.push({ url });
      form.setValue("images", images);
      setImages(images);
      const data = {
        url: url,
        store: storeId,
        user_id: userId,
      };
      getHttpClient().post("/api/user/images", data)
      .then(() => {})
        .catch((err) => {
          console.log(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const handleSetSubCategories = (val: string) => {
      if (subCategories?.includes(val)) {
        subCategories?.splice(subCategories?.indexOf(val), 1);
        setSubCategories(subCategories?.filter((item) => item !== val));
      } else {
        if (subCategories.length > 4) {
          return;
        }
        setSubCategories((prevValue) => [...prevValue, val]);
      }
    };
  
    const handleSetCollections = (val: string) => {
      if (collections?.includes(val)) {
        collections?.splice(collections?.indexOf(val), 1);
        setCollections(collections?.filter((item) => item !== val));
      } else {
        if (collections.length > 4) {
          return;
        }
        setCollections((prevValue) => [...prevValue, val]);
      }
    };
  
    const handleSetTags = (val: string) => {
      if (tags?.includes(val)) {
        tags?.splice(tags?.indexOf(val), 1);
        setTags(tags?.filter((item) => item !== val));
      } else {
        if (tags.length > 4) {
          return;
        }
        setTags((prevValue) => [...prevValue, val]);
      }
    };

    return {
      optionItem, setOptionItem,
      categories,
      subCategoriesList,
      sizes, 
      colorsList,
      sizesList,
      images, setImages,
      tagsList,
      collectionsList,
      isLoading,
      product,
      collections,
      tags,
      brands,
      subCategories,
      colors,
      activeOptionItem, setActiveOptionItem,
      activeVariant, setActiveVariant,
      activeOption, setActiveOption,
      category, setCategory,
      brand, setBrand,
      form,
      create,
      update,
      isCreating,
      isUpdating,
      handleAddOptionItem,
      handleRemoveOptionItem,
      handleEditColor,
      handleAddImage,
      handleAddItemSelected,
      handleDeleteAllImage,
      handleSaveImage,
      handleSetSubCategories,
      handleSetCollections,
      handleSetTags
    }

  }
