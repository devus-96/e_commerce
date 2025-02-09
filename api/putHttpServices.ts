import { toast } from '@/hooks/use-toast';
import { getHttpClient } from '@/lib/http';
import { TypeOrderItemModel } from '@/types/models';
import axios, { AxiosError } from 'axios';

/**
 * Effectue une requête PUT vers l'API.
 * @param {string} url - L'endpoint de l'API.
 * @param {Object} arg - Les données à envoyer dans le corps de la requête.
 * @param {string} arg.status - Le statut à mettre à jour.
 * @param {Object} order - L'objet contenant l'ID de la commande.
 */
export const putRequest = async (url: string, { arg }: { arg: { status: string } }, order: TypeOrderItemModel,) => {

  try {
    const response = await getHttpClient().put(
      process.env.NEXT_PUBLIC_API_URL + url,
      arg,
      {
        params: { _id: order._id }
      }
    );

    const data = response.data;
    toast({
      variant: 'default',
      title: 'Well done',
      description: data.message,
    });
    return data; // Retourne les données pour une utilisation ultérieure
  } catch (err: any) {
    toast({
      variant: 'destructive',
      title: 'OOps ❌',
      description: err.message,
    });
    console.error(err.message);
    throw err; // Propage l'erreur pour la gérer ailleurs
  }
};