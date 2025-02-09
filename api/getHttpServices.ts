import { toast } from '@/hooks/use-toast';
import { getHttpClient } from '@/lib/http';
import { TypeOrderItemModel } from '@/types/models';

export const fetchProducts = async (storeId: string) => {
    try {
      const response = await getHttpClient().get(
        process.env.NEXT_PUBLIC_API_URL + '/api/user/products',
        {
          params: storeId , // Assurez-vous que storeId est un objet si l'API attend un objet
        }
      );
      return response.data.data; // Retourne les données
    } catch (error) {
      throw error; // Propage l'erreur pour la gérer ailleurs
    }
  };

export const fetchSlide = async () => {
    try {
        const response = await getHttpClient().get(process.env.NEXT_PUBLIC_API_URL + "/api/public/slides",);
        return response.data.data; // Retourne les données
      } catch (error) {
        throw error; // Propage l'erreur pour la gérer ailleurs
      }
};

export const fetchSalesAndEarnings = async (storeId: string) => {
    try {
        const response = await getHttpClient().get(process.env.NEXT_PUBLIC_API_URL + "/api/public/slides", {
            params: { storeId, action: 'earning' }
        })

        const sales = response.data.data;
        const earnings = sales.reduce((total: number, currentValue: TypeOrderItemModel) => total + currentValue.earning, 0);

        return { sales, earnings };

    } catch (error) {
        throw error; // Propage l'erreur pour la gérer ailleurs
    }
};

export const getOrderitems = async (_id: string) => {
    try {
      const response = await getHttpClient().get(
        process.env.NEXT_PUBLIC_API_URL + "/api/user/orderitems",
        {
          params: { _id: _id },
        }
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  };
  
  export const getEarnings = async (store: string) => {
    try {
      const response = await getHttpClient().get(
        process.env.NEXT_PUBLIC_API_URL + "/api/user/orderitems",
        {
          params: { storeId: store, action: "earning" },
        }
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  };

  export const updateTrackOrder = async (e: string, order: TypeOrderItemModel) => {
    await getHttpClient()
      .put(
        process.env.NEXT_PUBLIC_API_URL + "/api/user/trackorders",
        { status: e },
        {
          params: { _id: order.trackorder._id },
        }
      )
      .then((response) => {
        const data = response.data;
        toast({
          variant: "default",
          title: "Well done",
          description: data.message,
        });
      });
  };