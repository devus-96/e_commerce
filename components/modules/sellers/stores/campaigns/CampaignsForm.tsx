"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SlideitemValidationSchema } from "@/types/schemas";
import { z } from "zod";
import ImageUpload from "@/components/custom/ImageUpload";
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
import { statusCampaigns } from "@/constants";
import { slugString } from "@/lib/helpers";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import Loading from "@/components/custom/Loading";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { campaignService } from "@/api/campaignServices";
import { useAuth } from "@clerk/nextjs";
import { useStoreData } from "@/services/useHttpServices";

export default function CampaignForm({
  storeId,
  _id,
}: {
  storeId?: string;
  _id?: string;
}) {
  // 0. set state
  const { userId } = useAuth();
  const {create, update, isloading, form, slideitem, slides} = campaignService(storeId, _id)
  const {products} = useStoreData(storeId)

  // 6. Define a submit handler.
  const onSubmit = async (
    values: z.infer<typeof SlideitemValidationSchema>
  ) => {
    const data = {
      slide: values.slide,
      product: values.product,
      name: values.name,
      slug: values.slug,
      description: values.description,
      image: values.image,
      status: values.status,
      title: values.title,
      subtitle: values.subtitle,
      textColor: values.textColor,
      btn: values.btn,
      store: storeId,
      user_id: userId,
    };

    if (slideitem) {
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
      {isloading && <Loading loading={true} />}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap space-y-4 justify-between items-center">
          <Heading
            name={
              slideitem
                ? `campaign - ${slideitem.name.substring(0, 15)}`
                : `Add new campaign`
            }
            description="Fill the required (*) input(s) and click on save to continue."
          />
          {slideitem?.status === "approve" && (
            <Badge variant="secondary">Campaign approved</Badge>
          )}
          {slideitem?.status === "reject" && (
            <Badge variant="destructive">Campaign rejected</Badge>
          )}
          <Link
            href={`/stores/${storeId}/campaigns`}
            className="bg-black p-4 flex items-center gap-4 text-white rounded-md text-xl"
          >
            <ChevronLeft className="me-1" />
            Go to list
          </Link>
        </div>
        <Separator />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12 my-8">
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
                    name="slide"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zone</FormLabel>
                        <FormControl>
                          <Select
                            disabled={isloading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a slide"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {slides &&
                                slides.map((item) => (
                                  <SelectItem
                                    key={item.name}
                                    value={item._id}
                                    className="capitalize"
                                    title={item.description}
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Check the &nbsp;
                          <Link
                            target="_blank"
                            className="underline text-primary-900"
                            href="/features"
                          >
                            Docs &nbsp;
                          </Link>
                          to make sure using the specifications required
                          otherwise your campaign might be rejected
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a product"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products &&
                                products.map((item) => (
                                  <SelectItem
                                    key={item._id}
                                    value={item._id}
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
                          <Textarea
                            cols={140}
                            rows={3}
                            placeholder="Put your description here."
                            {...field}
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
                  <CardTitle className="font-normal"> Optional info</CardTitle>
                </CardHeader>
                <CardContent className="p-10 flex flex-col gap-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="put title here" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave this empty if you want to use it in your banner
                          image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="put subtitle here" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave this empty if you want to use only in your
                          banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="btn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button</FormLabel>
                        <FormControl>
                          <Input placeholder="put button here" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave this empty if you want to use only in your
                          banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="textColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color of text</FormLabel>
                        <FormControl>
                          <Input className="w-50" type="color" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave this empty if you want to use only in your
                          banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-4">
              <Card className="rounded-xl bg-white shadow-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="font-normal">
                    Save your changes*
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <Button
                    className="max-w-40 text-xl capitalize"
                    variant="default"
                    size="lg"
                    disabled={
                      isloading ||
                      slideitem?.status === "approve"
                    }
                    type="submit"
                  >
                    save
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-white shadow-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="font-normal"> Image*</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            disabled={isloading}
                            onChange={(url) => {
                              field.onChange(url);
                            }}
                            onRemove={() => field.onChange("")}
                          />
                        </FormControl>
                        <FormDescription>
                          width and height depend on Zone. Check the
                          <Link
                            target="_blank"
                            className="underline text-primary-900"
                            href="/features"
                          >
                            Docs
                          </Link>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-white shadow-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="font-normal">Status* </CardTitle>
                </CardHeader>
                <CardContent className="py-10">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            disabled={
                              isloading || slideitem?.status === "approve"
                            }
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
                              {statusCampaigns.map((item) => (
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
                        <FormDescription className="flex gap-4 py-4 justify-center w-full">
                          <Info /> Hover an option in list to see more details
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}