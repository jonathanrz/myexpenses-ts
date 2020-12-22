import React, { useState } from "react";
import { AxiosInstance } from "axios";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { State } from "../../hooks/model";
import { Account } from "../../models/Account";
import Form from "./Form";
import { CreditCard } from "./model";

interface CreditCardRowProps {
  creditCard: CreditCard;
  axios: AxiosInstance;
  accountsAsync: State<Array<Account>>;
  onCreditCardSaved: () => void;
  deleteCreditCard: (id: string) => void;
}

function CreditCardRow({
  creditCard,
  axios,
  accountsAsync,
  onCreditCardSaved,
  deleteCreditCard,
}: CreditCardRowProps) {
  const [edit, setEdit] = useState(false);

  function renderAccountName(account?: Account) {
    if (!account) return "No account";
    if (accountsAsync.pending) return "Loading...";

    const accountData = accountsAsync.result?.find((a) => a.id === account.id);
    if (!accountData) return "Account not found";

    return accountData.name;
  }

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={2}>
          <Form
            axios={axios}
            accountsAsync={accountsAsync}
            creditCard={creditCard}
            onCreditCardSaved={() => {
              setEdit(false);
              onCreditCardSaved();
            }}
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
