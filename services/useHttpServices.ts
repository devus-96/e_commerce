import { useState, useEffect } from 'react';
import { fetchSalesAndEarnings, fetchProducts, fetchSlide } from '@/api/getHttpServices';
import { TypeOrderItemModel, TypeProductModel, TypeSlideModel } from '@/types/models';

/**
 * Hook personnalisé pour récupérer les produits, les ventes et les gains.
 * @param {string} storeId - L'ID du magasin.
 * @returns {Object} - Les données et l'état de chargement.
 */
export const useStoreData = (storeId: string | undefined) => {
  const [products, setProducts] = useState<TypeProductModel[]>();
  const [sales, setSales] = useState<TypeOrderItemModel[]>([]);
  const [earnings, setEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<TypeSlideModel[]>();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      try {
        if (storeId) {
            const productsData = await fetchProducts(storeId);
            const { sales: salesData, earnings: earningsData } = await fetchSalesAndEarnings(storeId);
            setProducts(productsData);
            setSales(salesData);
            setEarnings(earningsData);
        }
        
        const slideData = await fetchSlide();
        setSlides(slideData)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [storeId]);

  return { products, sales, earnings, loading, slides };
};