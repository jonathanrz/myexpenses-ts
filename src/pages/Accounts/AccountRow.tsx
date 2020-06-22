import React, { useState } from "react";
import numbro from "numbro";
import { AxiosInstance } from "axios";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Form from "./Form";
import { Account } from "./model";

interface AccountRowProps {
  account: Account;
  axios: AxiosInstance;
  onAccountSaved: () => void;
  deleteAccount: (id: string) => void;
}

function AccountRow({
  account,
  axios,
  onAccountSaved,
  deleteAccount,
}: AccountRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            axios={axios}
            account={account}
            onAccountSaved={() => {
              setEdit(false);
              onAccountSaved();
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
        {account.name}
      </TableCell>
      <TableCell align="right">
        {numbro(account.balance / 100).formatCurrency({
          mantissa: 2,
        })}
      </TableCell>
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
