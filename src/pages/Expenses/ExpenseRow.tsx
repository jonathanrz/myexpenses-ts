import React, { useState } from "react";
import { AxiosInstance } from "axios";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { State } from "../../hooks/model";
import { Account } from "../Accounts/model";
import Currency from "../../helpers/currency";
import Form from "./Form";
import { Expense } from "./model";

interface ExpenseRowProps {
  expense: Expense;
  axios: AxiosInstance;
  accountsAsync: State<Array<Account>>;
  onExpenseSaved: () => void;
  onExpenseUpdated: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
}

function ExpenseRow({
  expense,
  axios,
  accountsAsync,
  onExpenseSaved,
  onExpenseUpdated,
  deleteExpense,
}: ExpenseRowProps) {
  const [edit, setEdit] = useState(false);

  function renderAccountName(account?: Account) {
    if (!account) return "No account";
    if (accountsAsync.pending) return "Loading...";

    const accountData = accountsAsync.result?.find((a) => a.id === account.id);
    if (!accountData) return "Account not found";

    return accountData.name;
  }

  function toggleConfirm() {
    const path = `/expenses/${expense.id}/${
      expense.confirmed ? "unconfirm" : "confirm"
    }`;

    axios
      .post(path)
      .then(() =>
        onExpenseUpdated({ ...expense, confirmed: !expense.confirmed })
      );
  }

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={2}>
          <Form
            axios={axios}
            accountsAsync={accountsAsync}
            expense={expense}
            onExpenseSaved={() => {
              setEdit(false);
              onExpenseSaved();
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
        {expense.name}
      </TableCell>
      <TableCell component="th" scope="row">
        {renderAccountName(expense.account)}
      </TableCell>
      <TableCell component="th" scope="row">
        {expense.date.format("DD/MM/yyyy")}
      </TableCell>
      <TableCell component="th" scope="row">
        {Currency.format(expense.value)}
      </TableCell>
      <TableCell component="th" scope="row">
        <Switch checked={expense.confirmed} onChange={toggleConfirm} />
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton
          component="button"
          onClick={() => deleteExpense(expense.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default ExpenseRow;
