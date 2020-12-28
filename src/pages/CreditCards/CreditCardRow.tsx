import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Account } from "models/Account";
import { CreditCard } from "models/CreditCard";
import useAccountsQuery from "queries/accounts";
import Form from "./Form";

interface CreditCardRowProps {
  creditCard: CreditCard;
  deleteCreditCard: (id: string) => void;
}

function CreditCardRow({ creditCard, deleteCreditCard }: CreditCardRowProps) {
  const [edit, setEdit] = useState(false);
  const { query: accountsQuery } = useAccountsQuery();

  function renderAccountName(account?: Account) {
    if (!account) return "No account";
    if (accountsQuery.isLoading) return "Loading...";

    const accountData = accountsQuery.data?.find((a) => a.id === account.id);
    if (!accountData) return "Account not found";

    return accountData.name;
  }

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={2}>
          <Form
            creditCard={creditCard}
            onCreditCardSaved={() => setEdit(false)}
            onCancel={() => setEdit(false)}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {creditCard.name}
      </TableCell>
      <TableCell component="th" scope="row">
        {renderAccountName(creditCard.account)}
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton
          component="button"
          onClick={() => deleteCreditCard(creditCard.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default CreditCardRow;
