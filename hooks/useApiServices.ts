export function useApiServices () {
    function getResquest<T> (storeId: string | undefined) {
        const fetcher: Fetcher<T[], string> = async (url) => {
          return await axios
            .get(url, {
              params: storeId ? { storeId: storeId } : undefined,
            })
            .then((res) => res.data.data)
            .catch((err) => {
              toast({
                variant: "default",
                title: "OOps ❌",
                description: err.message,
              });
            })
            .finally(() => {});
        };
      
        return fetcher
      }


}