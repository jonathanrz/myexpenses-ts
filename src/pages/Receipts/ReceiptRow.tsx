import React, { useState } from "react";
import { AxiosInstance } from "axios";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { State } from "../../hooks/model";
import { Account } from "../Accounts/model";
import Currency from "../../helpers/currency";
import Form from "./Form";
import { Receipt } from "./model";

interface ReceiptRowProps {
  receipt: Receipt;
  axios: AxiosInstance;
  accountsAsync: State<Array<Account>>;
  onReceiptSaved: () => void;
  deleteReceipt: (id: string) => void;
}

function ReceiptRow({
  receipt,
  axios,
  accountsAsync,
  onReceiptSaved,
  deleteReceipt,
}: ReceiptRowProps) {
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
            receipt={receipt}
            onReceiptSaved={() => {
              setEdit(false);
              onReceiptSaved();
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
        {receipt.name}
      </TableCell>
      <TableCell component="th" scope="row">
        {renderAccountName(receipt.account)}
      </TableCell>
      <TableCell component="th" scope="row">
        {receipt.date.format("DD/MM/yyyy")}
      </TableCell>
      <TableCell component="th" scope="row">
        {Currency.format(receipt.value)}
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton
          component="button"
          onClick={() => deleteReceipt(receipt.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default ReceiptRow;
