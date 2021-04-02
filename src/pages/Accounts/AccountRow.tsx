import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Currency from "helpers/currency";
import { Account } from "models/Account";
import Form from "./Form";

interface AccountRowProps {
  account: Account;
  deleteAccount: (id: string) => void;
}

function AccountRow({ account, deleteAccount }: AccountRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            account={account}
            onAccountSaved={() => setEdit(false)}
            onCancel={() => setEdit(false)}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow data-testid={`account-row-${account.id}`}>
      <TableCell>{account.name}</TableCell>
      <TableCell align="right">{Currency.format(account.balance)}</TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton
          component="button"
          onClick={() => deleteAccount(account.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default AccountRow;
