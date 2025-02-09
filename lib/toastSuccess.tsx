import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import Link from "next/link";

export function ToastSucess (response: any, storeId: string | undefined, link: string) {
    if (response.success === false) {
      toast({
        variant: 'default',
        title: 'Upgrade to Pro!',
        description: response.message,
      });
    } else {
      toast({
        variant: 'default',
        title: 'Well done ✔️',
        description: response.message,
        action: (
          <ToastAction altText={`Go to ${response.data.name}`}>
            <Link href={link}>
              Go to {response.data.name.substring(0, 15)}
            </Link>
          </ToastAction>
        ),
      });
    }
  }