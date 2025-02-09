import useSWRMutation from 'swr/mutation';
import { putRequest } from '@/api/putHttpServices';
import { TypeOrderItemModel } from '@/types/models';

/**
 * Hook personnalisé pour mettre à jour le statut d'une commande.
 * @param {string} orderId - L'ID de la commande à mettre à jour.
 * @returns {Object} - Les méthodes et états de la mutation.
 */
export const useUpdateOrderStatus = (orderId: TypeOrderItemModel) => {
    const { trigger: update, isMutating: isUpdating } = useSWRMutation<
        any, // Type de la réponse (Data)
        Error, // Type de l'erreur
        string, // Type de la clé (Key)
        { status: string } // Type de l'argument (Arg)
  >('/api/user/orderitems', (url, { arg }) => putRequest(url, { arg }, orderId ));

  return { update, isUpdating };
};


