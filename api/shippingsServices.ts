import { getHttpClient } from "@/lib/http";
import { ShippingFormData } from "@/types/forms";
import { shippingValidationSchema } from "@/types/schemas";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { infer, z } from "zod";
import { toast } from "@/hooks/use-toast";
import { ToastSucess } from "@/lib/toastSuccess";
import useSWRMutation from "swr/mutation";

export function shippingServices (store: string, _id?: string) {
    const { userId } = useAuth();
    const [shipping, setShippings] = useState<ShippingFormData>();
    const [value, setValue] = useState<string[]>([]);
    const [ isFetchingShippings, setFetchingShippings] = useState<boolean>(false)
    // 4. Define your validation and default values.
      const form = useForm<z.infer<typeof shippingValidationSchema>>({
        resolver: zodResolver(shippingValidationSchema),
        defaultValues: shipping
          ? shipping
          : {
              name: "",
              slug: "",
              description: "",
              status: "draft",
              image: "https://cdn-icons-png.flaticon.com/128/10446/10446694.png",
              user_id: userId,
              region: value,
              delay: 0,
              fixed_amount: 0,
              fees: 0,
              unit_price_weight: 0,
              price_range_start: 0,
              price_range_end: 0,
              store: store,
            },
      });

      // 5. Reset form default values if edit
  useEffect(() => {
    const getData = async () => {
    setFetchingShippings(true);
    getHttpClient().get("/api/user/shippings?_id=" + _id, {
        params: {store: store}
    }).then((res) => {
        setShippings(res.data.data);
        setValue(res.data.data.region);
        form.reset(res.data.data);
    }).catch((err) => {
        toast({
            variant: 'default',
            title: 'OOps ❌',
            description: err.message,
          });
    })
    .finally(() => {
        setFetchingShippings(false)
    })
    };
    getData();
  }, [form.reset]);

  // 2. Form method
  function postRequest(url: string, { arg }: { arg: ShippingFormData }) {
    return getHttpClient().post(url, arg)
      .then((response) => {
        ToastSucess(response.data, store, `/admin/shippings/${response.data.data._id}`)
      })
      .catch((err) => {
        toast({
            variant: 'default',
            title: 'OOps ❌',
            description: err.message,
          });
      })
      .finally(() => {
        window.location.reload()
      });
  }

  async function putRequest(url: string, { arg }: { arg: ShippingFormData }) {
    return getHttpClient().put(url, arg, {
        params: { _id: shipping?._id }
    })
      .then((response) => {
        ToastSucess(response.data, store, `/admin/shippings`)
      })
      .catch((err) => {
        toast({
            variant: 'default',
            title: 'OOps ❌',
            description: err.message,
          });
      })
      .finally(() => {});
  }

  // 3. Set Form mutation
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/user/shippings",
    postRequest /* options */
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/user/shippings",
    putRequest /* options */
  );

  return { 
    create, isCreating,
    update, isUpdating,
    isLoading: isFetchingShippings,
    shipping,
    form
  }
}