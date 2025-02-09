import { toast } from '@/hooks/use-toast';
import { SlideitemFormData } from '@/types/forms';
import { TypeSlideItemModel, TypeSlideModel } from '@/types/models';
import { SlideitemValidationSchema } from '@/types/schemas';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useSWRMutation from "swr/mutation";
import { ToastSucess } from '@/lib/toastSuccess';
import { getHttpClient } from '@/lib/http';
import useSWR, { Fetcher } from 'swr';
import { fetchSlide } from './slides';


export const campaignService = (storeId: string | undefined, id?: string | undefined) => {
  const { userId } = useAuth();
  const [isFetchingCampaigns, setFetchingCampaigns] = useState<boolean>(false)
  const [slideitem, setData] = useState<SlideitemFormData | null>(null)
  const {getSlides, isFetchingSlides, slides} = fetchSlide()

  const fetcher: Fetcher<TypeSlideItemModel[], string> = async (url) => {
    return getHttpClient()
      .get(url, {
        params: { storeId: storeId },
      })
      .then((res) => res.data.data)
      .catch((err) => {
        toast({
          variant: 'default',
          title: 'OOps ❌',
          description: err.message,
        });
      })
  };

  const form = useForm<z.infer<typeof SlideitemValidationSchema>>({
      resolver: zodResolver(SlideitemValidationSchema),
      defaultValues: slideitem
        ? slideitem
        : {
            slide: slides && slides[0]._id,
            name: "",
            description: "",
            slug: "",
            image: "https://cdn-icons-png.flaticon.com/128/10446/10446694.png",
            store: storeId,
            user_id: userId,
            status: "draft",
          },
    });

  // 5. Reset form default values if edit
     useEffect(() => {
      const getData = async () => {
        setFetchingCampaigns(true); //loading
        getHttpClient().get("/api/user/campaigns").then((response) => {
          setData(response.data.data);
          form.reset(response.data.data);
        }).catch((err) => {
          toast({
            variant: 'default',
            title: 'OOps ❌',
            description: err.message,
          });
        })
        .finally(() => {
          setFetchingCampaigns(false)
        })
      };
      if (id) {
        getData();
      }
      getSlides()
    }, [form.reset]);

  const postRequest = async (url: string, { arg }: { arg: SlideitemFormData }) => {
      getHttpClient().post(url, arg).then((response) => {
        ToastSucess(response, storeId, `/stores/${storeId}/campaigns/${response.data._id}`)
      })
      .catch((err) => {
        toast({
          variant: 'default',
          title: 'OOps ❌',
          description: err.message,
        });
      }).finally(() => {
        window.location.reload();
      })
      
  }

  const putRequest = async (url: string , { arg }: { arg: SlideitemFormData }) => {
    getHttpClient().put(url, arg, {
      params: {id: id}
    }).then((response) => {
        ToastSucess(response, storeId, `/stores/${storeId}/campaigns/${response.data._id}`)
      })
      .catch((err) => {
        toast({
          variant: 'default',
          title: 'OOps ❌',
          description: err.message,
        });
      })
      
  }

  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/user/campaigns",
    postRequest /* options */
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/user/campaigns",
    putRequest /* options */
  );

  const { data, isLoading } = useSWR<TypeSlideItemModel[]>(
    "/api/user/campaigns?storeId=" + storeId,
    fetcher
  );

  return { 
    slideitem,
    slides,
    create,
    update,
    form,
    data,
    isLoading,
    isloading: isUpdating || isCreating || isFetchingCampaigns || isFetchingSlides
  }
};