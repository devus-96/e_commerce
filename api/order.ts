import { toast } from '@/hooks/use-toast';
import { TypeOrderItemModel } from '@/types/models';
import { getHttpClient } from '@/lib/http';

/**
 * Effectue une requête PUT vers l'API.
 * @param {string} url - L'endpoint de l'API.
 * @param {Object} arg - Les données à envoyer dans le corps de la requête.
 * @param {string} arg.status - Le statut à mettre à jour.
 * @param {Object} order - L'objet contenant l'ID de la commande.
 */

export function Order (order: TypeOrderItemModel) {
    async function putRequest(url: string, { arg }: { arg: { status: string } }) {
        return getHttpClient()
          .put(process.env.NEXT_PUBLIC_API_URL + url, arg, {
            params: { _id: order._id },
          })
          .then(async (response) => {
            const data = response.data;
            toast({
              variant: "default",
              title: "Well done",
              description: data.message,
            });
          })
          .catch((err) => {
            toast({
              variant: "default",
              title: "OOps ❌",
              description: err.message,
            });
            console.log(err.message);
          })
          .finally(() => {});
      }

      return {
        putRequest
      }
}
