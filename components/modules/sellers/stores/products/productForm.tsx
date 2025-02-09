"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@clerk/nextjs";
import { productValidationSchema } from "@/types/schemas";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
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
import { slugString } from "@/lib/helpers";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ChevronsUpDown,
  Loader2Icon,
  Plus,
  TicketPercent,
  X,
} from "lucide-react";
import Loading from "@/components/custom/Loading";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import "react-medium-image-zoom/dist/styles.css";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { status, inventory, units } from "@/constants";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { productServives } from "@/api/products/productServices";
import MultipleUpload from "@/components/custom/MultipleUpload";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function ProductForm({
  storeId,
  _id,
}: {
  storeId: string;
  _id?: string;
}) {
  // 0. set state
  const { userId } = useAuth();
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const [openTag, setOpenTag] = useState(false);

  const {
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
  } = productServives(_id, storeId)

  // 6. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof productValidationSchema>) => {
    if (
      !category ||
      subCategories?.length === 0 ||
      !brand ||
      colors.length === 0
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Fill category, sub categories, brand and select one option at least",
      });
      return;
    }
    const data = {
      category: category ? category : "",
      name: values.name,
      slug: values.slug,
      brand: brand ? brand : "",
      subCategories: subCategories ? subCategories : [],
      collections: collections ? collections : [],
      tags: tags ? tags : [],
      description: values.description,
      additionnal: values.additionnal,
      specification: values.specification,
      images: values.images,
      price: values.price,
      discount: values.discount,
      status: values.status,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
      seoSlug: values.seoSlug,
      store: storeId,
      user_id: userId,
      unit: values.unit,
      sku: values.sku,
      weight: values.weight,
      inventory: values.inventory,
    };

    if (_id) {
      await update(data);
    } else {
      await create(data);
    }
  };

  // 7. Update slug
  const createSlug = (value: string) => {
    const val = slugString(value);
    form.setValue("slug", val);
  };

  
  return (
    <>
      {isLoading && <Loading loading={true} />}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap space-y-4 justify-between items-center">
          <Heading
            name={
              product
                ? `Edit product - ${product.name.substring(0, 15)}`
                : `Add new product`
            }
            description="Fill the required (*) input(s) and click on save to continue."
          />
          <Link
            href={`/stores/${storeId}/products`}
            className="bg-black p-4 flex items-center gap-4 text-white rounded-md text-xl"
          >
            Go to list
            <ChevronRight className="me-1" />
          </Link>
        </div>
        <Separator />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <input type="hidden" name="subCategories" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12 my-8">
            {/* first colonne  */}
            <div className="col-span-2 space-y-4">
              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Images*</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4  w-full overflow-x-auto">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <MultipleUpload
                              deleteImages={() => {
                                field.onChange([]);
                                setImages([]);
                              }}
                              value={field.value.map(
                                (image: TypeImage) => image.url
                              )}
                              disabled={isLoading}
                              onChange={(url: string) => {
                                handleSaveImage(url);
                              }}
                              onRemove={(url: string) =>
                                field.onChange([
                                  ...field.value.filter(
                                    (current: TypeImage) => current.url !== url
                                  ),
                                ])
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Basics info*</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 flex flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              className="lowercase"
                              onInput={(e) => createSlug(e.currentTarget.value)}
                              placeholder="put name here"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>slug</FormLabel>
                          <FormControl>
                            <Input
                              className="font-bold"
                              readOnly
                              placeholder="slug-auto-generated"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is auto generated for you!
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <ReactQuill
                              theme="snow"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">
                      Additionnal info*
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 flex flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="additionnal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>More details</FormLabel>
                          <FormControl>
                            <ReactQuill
                              theme="snow"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specifications</FormLabel>
                          <FormControl>
                            <ReactQuill
                              theme="snow"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Price*</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 flex flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount</FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Options(*) </CardTitle>
                    <CardDescription>
                      Your product may have some options such as size, color.
                      Add them here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 flex flex-col gap-8">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="default"
                          className="w-fit"
                          disabled={isLoading}
                        >
                          Add an option
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full">
                        <DialogHeader>
                          <DialogTitle className="text-h5">
                            Add an item option
                          </DialogTitle>
                          <DialogDescription>
                            select a color or a size.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center justify-start gap-4 w-full">
                            <Label htmlFor="option" className="">
                              Option name
                            </Label>
                            <Select onValueChange={(e) => setActiveOption(e)}>
                              <SelectTrigger className="w-[340px]">
                                <SelectValue
                                  placeholder="select an option"
                                  id="option"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="color">color</SelectItem>
                                <SelectItem value="size">size</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            {activeOption === "color" && (
                              <>
                                <Label htmlFor="choices" className="">
                                  Select a color
                                </Label>
                                <Select
                                  onValueChange={(slug) =>
                                    handleAddItemSelected(slug)
                                  }
                                >
                                  <SelectTrigger className="w-[340px]">
                                    <SelectValue placeholder="Select a item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {colorsList &&
                                      colorsList.map((color) => (
                                        <SelectItem
                                          value={color.slug}
                                          key={color.slug}
                                        >
                                          {color.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </>
                            )}

                            {activeOption === "size" && (
                              <>
                                <Label htmlFor="choices" className="">
                                  Select a size
                                </Label>
                                <Select
                                  onValueChange={(slug) =>
                                    handleAddItemSelected(slug)
                                  }
                                >
                                  <SelectTrigger className="w-[340px]">
                                    <SelectValue placeholder="Select a item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sizesList &&
                                      sizesList.map((size) => (
                                        <SelectItem
                                          value={size.slug}
                                          key={size.slug}
                                        >
                                          {size.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </>
                            )}
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="choices" className="">
                              Create new
                            </Label>
                            <Input
                              id="choices"
                              onChange={(e) =>
                                setOptionItem(e.target.value.toLowerCase())
                              }
                              value={optionItem}
                              placeholder="Type and hit entrer key"
                              className="w-[340px]"
                              onKeyDown={handleAddOptionItem}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 flex-wrap w-full">
                          <span>Colors</span>
                          <Separator />
                          {colors.map((item: TypeColorModel) => (
                            <Badge
                              key={item.slug}
                              title="delete"
                              className="cursor-pointer"
                              variant="default"
                              onClick={() => handleRemoveOptionItem(item.slug)}
                            >
                              {item.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-3 flex-wrap w-full">
                          <span>Sizes</span>
                          <Separator />
                          {sizes.length > 0 &&
                            sizes.map((item: TypeSizeModel) => (
                              <Badge
                                key={item.slug}
                                title="close"
                                className="cursor-pointer"
                                variant="default"
                                onClick={() =>
                                  handleRemoveOptionItem(item.slug)
                                }
                              >
                                {item.name}
                              </Badge>
                            ))}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <div className="flex gap-4">
                      <div className="flex gap-3 flex-wrap w-full">
                        <span>Colors</span>
                        <Separator />
                        {colors.map((item: TypeColorModel) => (
                          <Badge
                            key={item.slug}
                            title=""
                            className="cursor-pointer flex gap-4 group "
                            variant="default"
                          >
                            <Button
                              title="delete"
                              className="hidden justify-items-center group-hover:grid hover:bg-red-900 bg-red-900 h-6 w-6 text-white !p-0 !m-0 rounded-full"
                              onClick={() => handleRemoveOptionItem(item.slug)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {item.name}

                            {item.value && (
                              <div
                                className={cn(
                                  "h-3 w-3 rounded-full outline-2 offset-outline-offset-4",
                                  !item.value && "hidden"
                                )}
                                style={{
                                  background: item.value,
                                }}
                              ></div>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setActiveOptionItem(item)}
                                  title="join a value"
                                  className="hidden justify-items-center group-hover:grid hover:bg-black-900 hover:text-white bg-green-900 h-6 w-6 text-white !p-0 !m-0 rounded-full"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-full z-50">
                                <DialogHeader>
                                  <DialogTitle className="text-sm">
                                    Add a color value and images to your item
                                  </DialogTitle>
                                  <DialogDescription>
                                    Select a color and multiple image from the
                                    inputs below
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex flex-col space-y-4 items-center justify-start gap-4 w-full">
                                    <div className="w-full flex gap-4 items-center">
                                      <Label htmlFor="option" className="">
                                        Color:
                                      </Label>
                                      <Badge
                                        title=""
                                        className="cursor-pointer flex gap-4 group "
                                        variant="default"
                                      >
                                        {activeOptionItem?.name}

                                        {item.value && (
                                          <div
                                            className="h-3 w-3 rounded-full outline-2 offset-outline-offset-4"
                                            style={{
                                              background: item.value,
                                            }}
                                          ></div>
                                        )}
                                      </Badge>
                                    </div>

                                    <div className="w-full flex gap-4 items-center">
                                      <Label htmlFor="option" className="">
                                        Value:
                                      </Label>
                                      <Input
                                        onChange={(e) => handleEditColor(e)}
                                        placeholder="click here"
                                        type="color"
                                        value={activeOptionItem?.value}
                                      />
                                    </div>

                                    <div className="w-full flex gap-4 items-center">
                                      <Label htmlFor="option" className="">
                                        Image(s):
                                      </Label>

                                      <div className="max-h-[300px] overflow-auto flex flex-wrap gap-4">
                                        {images.map(
                                          (image: TypeImage, idx: number) => (
                                            <div
                                              key={idx}
                                              className="group relative w-[50px] h-[50px] rounded-md overflow-hidden border border-black"
                                            >
                                              <Image
                                                src={image.url}
                                                fill
                                                alt="simple image"
                                              />
                                              <div className="flex justify-between p-1">
                                                <Button
                                                  title="add"
                                                  className={cn(
                                                    "hidden justify-items-center group-hover:grid bg-green-900 h-4 w-4 text-white !p-0 !m-0 rounded-full",
                                                    activeOptionItem?.images.find(
                                                      (val) =>
                                                        val.url === image.url
                                                    ) && "grid"
                                                  )}
                                                  onClick={() => {
                                                    if (
                                                      !activeOptionItem?.images.find(
                                                        (val) =>
                                                          val.url === image.url
                                                      )
                                                    ) {
                                                      handleAddImage(
                                                        image.url,
                                                        "color"
                                                      );
                                                    }
                                                  }}
                                                >
                                                  <Check className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                      <div>
                                        <Button
                                          title="delete all"
                                          variant="outline"
                                          className="ms-4 justify-items-center group-hover:grid bg-red-900 !px-2 
                                           bg-transparent text-black"
                                          onClick={() => handleDeleteAllImage()}
                                        >
                                          Delete all
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                      Close
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3 flex-wrap w-full">
                        <span>Sizes</span>
                        <Separator />
                        {sizes.length > 0 &&
                          sizes.map((item: TypeSizeModel) => (
                            <Badge
                              key={item.slug}
                              title="close"
                              className="cursor-pointer group flex gap-4"
                              variant="default"
                            >
                              <Button
                                title="delete"
                                className="hidden justify-items-center group-hover:grid hover:bg-red-900 bg-red-900 h-6 w-6 text-white !p-0 !m-0 rounded-full"
                                onClick={() =>
                                  handleRemoveOptionItem(item.slug)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              {item.name}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    onClick={() => setActiveOptionItem(item)}
                                    title="join a value"
                                    className="hidden justify-items-center group-hover:grid hover:bg-black-900 hover:text-white bg-green-900 h-6 w-6 text-white !p-0 !m-0 rounded-full"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full z-50">
                                  <DialogHeader>
                                    <DialogTitle className="text-sm">
                                      Add images to your item
                                    </DialogTitle>
                                    <DialogDescription>
                                      Choose image
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="flex flex-col space-y-4 items-center justify-start gap-4 w-full">
                                      <div className="w-full flex gap-4 items-center">
                                        <Label htmlFor="option" className="">
                                          Size:
                                        </Label>
                                        <Badge
                                          title=""
                                          className="cursor-pointer flex gap-4 group "
                                          variant="default"
                                        >
                                          {activeOptionItem?.name}

                                          {item.value && (
                                            <div
                                              className="h-3 w-3 rounded-full outline-2 offset-outline-offset-4"
                                              style={{
                                                background: item.value,
                                              }}
                                            ></div>
                                          )}
                                        </Badge>
                                      </div>

                                      <div className="w-full flex gap-4 items-center">
                                        <Label htmlFor="option" className="">
                                          Image(s):
                                        </Label>

                                        <div className="max-h-[300px] overflow-auto flex flex-wrap gap-4">
                                          {images.map(
                                            (image: TypeImage, idx: number) => (
                                              <div
                                                key={idx}
                                                className="group relative w-[50px] h-[50px] rounded-md overflow-hidden border border-black"
                                              >
                                                <Image
                                                  src={image.url}
                                                  fill
                                                  alt="simple image"
                                                />
                                                <div className="flex justify-between p-1">
                                                  <Button
                                                    title="add"
                                                    className={cn(
                                                      "hidden justify-items-center group-hover:grid bg-green-900 h-4 w-4 text-white !p-0 !m-0 rounded-full",
                                                      activeOptionItem?.images.find(
                                                        (val) =>
                                                          val.url === image.url
                                                      ) && "grid"
                                                    )}
                                                    onClick={() => {
                                                      if (
                                                        !activeOptionItem?.images.find(
                                                          (val) =>
                                                            val.url ===
                                                            image.url
                                                        )
                                                      ) {
                                                        handleAddImage(
                                                          image.url,
                                                          "size"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <Check className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                        <div>
                                          <Button
                                            title="delete all"
                                            variant="outline"
                                            className="ms-4 justify-items-center group-hover:grid bg-red-900 !px-2 
                                           bg-transparent text-black"
                                            onClick={() =>
                                              handleDeleteAllImage()
                                            }
                                          >
                                            Delete all
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button type="button" variant="secondary">
                                        Close
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8">
                      <Checkbox
                        disabled
                        id="terms"
                        onClick={() => setActiveVariant(!activeVariant)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Manage price and inventory for colors and sizes. (
                        scroll down to variants section if this is checked)
                      </label>
                      <Badge className="text-sm" variant="secondary">
                        Coming up
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "rounded-xl bg-white shadow-xl hidden",
                    activeVariant && "block"
                  )}
                >
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Variants</CardTitle>
                    <CardDescription>
                      You may want to manage price and inventory for each option
                      above. Do it here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 flex flex-col gap-8">
                    <div className="flex gap-4">
                      <Table>
                        <TableCaption>A list of your variants.</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Variant</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Sku</TableHead>
                            <TableHead>Inventory</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Images</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {colors.map((color: TypeColorModel, idx: number) =>
                            sizes.map((size: TypeSizeModel, idx_: number) => (
                              <TableRow key={idx + "-" + idx_}>
                                <TableCell className="font-bold tracking-wider">
                                  {color.slug}|<span>{size.slug}</span>
                                </TableCell>
                                <TableCell>
                                  <FormControl>
                                    <Input placeholder="0" />
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Select>
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select a value" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="instock">
                                        In stock
                                      </SelectItem>
                                      <SelectItem value="outstock">
                                        Out of stock
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-fit"
                                        disabled={isLoading}
                                      >
                                        Add image(s)
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-full">
                                      <DialogHeader>
                                        <DialogTitle className="text-h5">
                                          Add image to variant
                                        </DialogTitle>
                                        <DialogDescription>
                                          hover an image and click to select.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4 border border-border px-4">
                                        {images.map(
                                          (image: TypeImage, idx: number) => (
                                            <div
                                              key={idx}
                                              className="group relative w-[50px] h-[50px] rounded-md overflow-hidden border border-black"
                                            >
                                              <Image
                                                src={image.url}
                                                fill
                                                alt="simple image"
                                              />
                                              <div className="flex justify-between p-1">
                                                <Button
                                                  title="add"
                                                  className={cn(
                                                    "hidden justify-items-center group-hover:grid bg-green-900 h-4 w-4 text-white !p-0 !m-0 rounded-full",
                                                    activeOptionItem?.images.find(
                                                      (val) =>
                                                        val.url === image.url
                                                    ) && "grid"
                                                  )}
                                                  onClick={() => {
                                                    if (
                                                      !activeOptionItem?.images.find(
                                                        (val) =>
                                                          val.url === image.url
                                                      )
                                                    ) {
                                                      handleAddImage(
                                                        image.url,
                                                        "size"
                                                      );
                                                    }
                                                  }}
                                                >
                                                  <Check className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>

                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button
                                            type="button"
                                            variant="secondary"
                                          >
                                            Close
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                                <TableCell>
                                  <Select>
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="draft">
                                        Draft
                                      </SelectItem>
                                      <SelectItem value="publish">
                                        Publish
                                      </SelectItem>
                                      <SelectItem value="archived">
                                        Archived
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                        <TableFooter></TableFooter>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* second colonne  */}
            <div className="col-span-1 space-y-4">
              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">
                      Save your changes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <Button
                      className="max-w-40 text-xl capitalize "
                      variant="secondary"
                      size="lg"
                      disabled={isCreating || isUpdating || isLoading}
                      type="submit"
                    >
                      <Loader2Icon
                        className={cn(
                          "hidden mr-2 h-6 w-6 animate-spin",
                          isCreating || (isUpdating && "block")
                        )}
                      />
                      save
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Category*</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 w-[320px]">
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                      <PopoverTrigger
                        asChild
                        value={category}
                        defaultValue={category}
                        className="w-[320px]"
                      >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCategory}
                          className="justify-between"
                        >
                          <div className="flex gap-2 justify-start">
                            {category ? (
                              <div className="px-2 py-1 rounded-xl border bg-default-200 text-xs font-medium">
                                {categories &&
                                  categories.find(
                                    (item) => item._id === category
                                  )?.name}
                              </div>
                            ) : (
                              "Select category..."
                            )}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {categories &&
                                categories.map((item) => (
                                  <CommandItem
                                    key={item.name}
                                    value={item.name}
                                    onSelect={() => {
                                      setCategory(item._id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        category?.includes(item._id)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <Image
                                      src={item.image}
                                      width="30"
                                      height="30"
                                      alt="image"
                                    />

                                    <span className="ms-2">{item.name}</span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">
                      Sub Categories*
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <Popover
                      open={openSubCategory}
                      onOpenChange={setOpenSubCategory}
                    >
                      <PopoverTrigger
                        asChild
                        value={subCategories}
                        defaultValue={subCategories}
                      >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubCategory}
                          className="w-[320px] justify-between"
                        >
                          <div className="flex gap-2 justify-start">
                            {subCategories?.length
                              ? subCategories.map((val, i) => (
                                  <div
                                    key={i}
                                    className="px-2 py-1 rounded-xl border bg-default-200 text-xs font-medium"
                                  >
                                    {
                                      subCategoriesList?.find(
                                        (item) => item._id === val
                                      )?.name
                                    }
                                  </div>
                                ))
                              : "Select sub categories..."}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0">
                        <Command>
                          <CommandInput placeholder="Search sub category..." />
                          <CommandEmpty>No sub category found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {subCategoriesList?.map((item) => (
                                <CommandItem
                                  key={item._id}
                                  value={item._id}
                                  onSelect={() => {
                                    handleSetSubCategories(item._id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      subCategories?.includes(item._id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <Image
                                    src={item.image}
                                    width="30"
                                    height="30"
                                    alt="image"
                                  />

                                  <span className="ms-2">{item.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        <FormMessage />
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">Brand*</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <Popover open={openBrand} onOpenChange={setOpenBrand}>
                      <PopoverTrigger
                        asChild
                        value={brand}
                        defaultValue={brand}
                      >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openBrand}
                          className="w-[320px] justify-between"
                        >
                          <div className="flex gap-2 justify-start">
                            {brand ? (
                              <div className="px-2 py-1 rounded-xl border bg-default-200 text-xs font-medium">
                                {brands &&
                                  brands.find((item) => item._id === brand)
                                    ?.name}
                              </div>
                            ) : (
                              "Select brand..."
                            )}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0">
                        <Command>
                          <CommandInput placeholder="Search brand..." />
                          <CommandEmpty>No brand found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {brands &&
                                brands.map((item) => (
                                  <CommandItem
                                    key={item.name}
                                    value={item.name}
                                    onSelect={() => {
                                      setBrand(item._id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        brand?.includes(item._id)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <Image
                                      src={item.image}
                                      width="30"
                                      height="30"
                                      alt="image"
                                    />

                                    <span className="ms-2">{item.name}</span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        <FormMessage />
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Collections</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <Popover
                      open={openCollection}
                      onOpenChange={setOpenCollection}
                    >
                      <PopoverTrigger
                        asChild
                        value={collections}
                        defaultValue={collections}
                      >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCollection}
                          className="w-[320px] justify-between"
                        >
                          <div className="flex gap-2 justify-start">
                            {collections?.length
                              ? collections.map((val, i) => (
                                  <div
                                    key={i}
                                    className="px-2 py-1 rounded-xl border bg-default-200 text-xs font-medium"
                                  >
                                    {
                                      collectionsList?.find(
                                        (item) => item._id === val
                                      )?.name
                                    }
                                  </div>
                                ))
                              : "Select collection..."}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0">
                        <Command>
                          <CommandInput placeholder="Search collection..." />
                          <CommandEmpty>No collection found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {collectionsList?.map((item) => (
                                <CommandItem
                                  key={item.name}
                                  value={item.name}
                                  onSelect={() => {
                                    handleSetCollections(item._id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      collections?.includes(item._id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <Image
                                    src={item.image}
                                    width="30"
                                    height="30"
                                    alt="image"
                                  />

                                  <span className="ms-2">{item.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        <FormMessage />
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal"> Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <Popover open={openTag} onOpenChange={setOpenTag}>
                      <PopoverTrigger asChild value={tags} defaultValue={tags}>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openTag}
                          className="w-[320px] justify-between"
                        >
                          <div className="flex gap-2 justify-start">
                            {tags?.length
                              ? tags.map((val, i) => (
                                  <div
                                    key={i}
                                    className="px-2 py-1 rounded-xl border bg-default-200 text-xs font-medium"
                                  >
                                    {
                                      tagsList?.find((item) => item._id === val)
                                        ?.name
                                    }
                                  </div>
                                ))
                              : "Select tag..."}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0">
                        <Command>
                          <CommandInput placeholder="Search sub category..." />
                          <CommandEmpty>No sub category found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {tagsList?.map((item) => (
                                <CommandItem
                                  key={item.name}
                                  value={item.name}
                                  onSelect={() => {
                                    handleSetTags(item._id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      tags?.includes(item._id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <Image
                                    src={item.image}
                                    width="30"
                                    height="30"
                                    alt="image"
                                  />

                                  <span className="ms-2">{item.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        <FormMessage />
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4 col-span-2">
                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">Inventory*</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 space-y-4">
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Select
                                disabled={isCreating || isUpdating}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      defaultValue={field.value}
                                      placeholder="Select a value"
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {units.map((item) => (
                                    <SelectItem
                                      key={item.slug}
                                      value={item.slug}
                                      className="capitalize"
                                      title={item.description}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="AEN7ZDDZ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inventory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inventory</FormLabel>
                          <FormControl>
                            <Select
                              disabled={isCreating || isUpdating}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    defaultValue={field.value}
                                    placeholder="Select a value"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {inventory.map((item) => (
                                  <SelectItem
                                    key={item.name}
                                    value={item.slug}
                                    className="capitalize"
                                    title={item.description}
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">
                      Search Engine Optimization (SEO)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta title</FormLabel>
                          <FormControl>
                            <Input placeholder="Meta title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta description</FormLabel>
                          <FormControl>
                            <Textarea
                              cols={140}
                              rows={3}
                              placeholder="Meta description."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seoSlug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta slug</FormLabel>
                          <FormControl>
                            <Input placeholder="Meta slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">
                      Marketing
                      <Badge className="text-sm" variant="secondary">
                        Coming up
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 space-y-4">
                    <Link
                      className="text-blue-500 inline-flex gap-4"
                      href={cn(
                        // `/stores/${storeId}/coupons/new?productId=${_id}`
                        `#`
                      )}
                    >
                      <TicketPercent />
                      Create coupon
                    </Link>
                  </CardContent>
                </Card>

                <Card className="rounded-xl bg-white shadow-xl">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-normal">Status*</CardTitle>
                  </CardHeader>
                  <CardContent className="py-10">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              disabled={isCreating || isUpdating}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    defaultValue={field.value}
                                    placeholder="Select a status"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {status
                                  .filter(
                                    (l) =>
                                      l.name === "draft" || l.name === "publish"
                                  )
                                  .map((item) => (
                                    <SelectItem
                                      key={item.name}
                                      value={item.name}
                                      className="capitalize"
                                      title={item.description}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}