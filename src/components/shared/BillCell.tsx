import React from "react";
import { Bill } from "models/Bill";
import useBillsQuery from "queries/bills";

interface BillCellProps {
  bill?: Bill;
}

function BillCell({ bill }: BillCellProps) {
  const { query } = useBillsQuery();
  if (!bill) return <div>No bill</div>;
  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  const data = query.data?.find((a) => a.id === bill.id);
  if (!data) return <div>Bill not found</div>;
  return <div>{data.name}</div>;
}

export default BillCell;
