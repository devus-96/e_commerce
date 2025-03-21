import { getOrder } from "@/api/endpoint/order";
import Container from "@/components/custom/Container";
import WithdrawalForm from "@/components/modules/sellers/stores/withdrawals/WithdrawalForm";
import { Metadata } from "next";
import React from "react";

export default async function page({
  params,
}: {
  params: { _id: string; storeId: string };
}) {
  const { _id, storeId } = await params;
  const earnings = await getOrder({ storeId: storeId, action: "earning" });

  return (
    <>
      <section className="py-10">
        <Container>
          <WithdrawalForm _id={_id} earnings={earnings} />
        </Container>
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "New Shipping - Orion - Ecommerce",
  description:
    "A Ecommerce app. We are selling everything, shoes for mens womens and kids",
  icons: {
    icon: "/assets/images/logo_dark.svg",
  },
};
