import React from "react";
import { Account } from "models/Account";
import useAccountsQuery from "queries/accounts";

interface AccountCellProps {
  account?: Account;
}

function AccountCell({ account }: AccountCellProps) {
  const { query } = useAccountsQuery();
  if (!account) return <div>No account</div>;
  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  const accountData = query.data?.find((a) => a.id === account.id);
  if (!accountData) return <div>Account not found</div>;
  return <div>{accountData.name}</div>;
}

export default AccountCell;
