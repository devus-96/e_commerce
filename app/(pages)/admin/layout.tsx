import Header from "@/components/modules/admin/header";
import React from "react";

// Nextjs ISR caching strategy
export const revalidate = false;

export default async function Layout({ children }: { children: React.ReactNode }) {
    /*if ((await checkRole("admin")) === false) {
        redirect("/stores");
    }*/
    return (
    <>
      <Header />
      {children}
    </>
  );
}
