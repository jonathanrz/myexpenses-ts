import React from "react";
import { CreditCard } from "models/CreditCard";
import useQuery from "queries/creditCards";

interface CreditCardProps {
  creditCard?: CreditCard;
}

function CreditCardCell({ creditCard }: CreditCardProps) {
  const { query } = useQuery();
  if (!creditCard) return <div>No credit card</div>;
  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  const data = query.data?.find((a) => a.id === creditCard.id);
  if (!data) return <div>Credit card not found</div>;
  return <div>{data.name}</div>;
}

export default CreditCardCell;
