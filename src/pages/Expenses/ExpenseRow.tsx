import React, { useState } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Currency from "helpers/currency";
import AccountCell from "components/shared/AccountCell";
import BillCell from "components/shared/BillCell";
import CategoryCell from "components/shared/CategoryCell";
import CreditCardCell from "components/shared/CreditCardCell";
import { renderExpenseName } from "helpers/expense";
import { Expense } from "models/Expense";
import useExpensesQuery from "queries/expenses";
import Form from "./Form";

const currentMonth = moment();

interface ExpenseRowProps {
  expense: Expense;
  deleteExpense: (expense: Expense) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(2),
  },
}));

function ExpenseRow({ expense, deleteExpense }: ExpenseRowProps) {
  const classes = useStyles();

  const [updatingConfirm, setUpdatingConfirm] = useState(false);
  const [edit, setEdit] = useState(false);
  const { confirmMutation } = useExpensesQuery(currentMonth);

  function toggleConfirm() {
    setUpdatingConfirm(true);
    confirmMutation
      .mutateAsync(expense)
      .finally(() => setUpdatingConfirm(false));
  }

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={9}>
          <Form
            expense={expense}
            onExpenseSaved={() => setEdit(false)}
            onCancel={() => setEdit(false)}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {renderExpenseName(expense)}
      </TableCell>
      <TableCell component="th" scope="row">
        {expense.account ? (
          <AccountCell account={expense.account} />
        ) : (
          <CreditCardCell creditCard={expense.credit_card} />
        )}
      </TableCell>
      <TableCell component="th" scope="row">
        <CategoryCell category={expense.category} />
      </TableCell>
      <TableCell component="th" scope="row">
        <BillCell bill={expense.bill} />
      </TableCell>
      <TableCell component="th" scope="row">
        {expense.date.format("DD/MM/yyyy")}
      </TableCell>
      <TableCell component="th" scope="row">
        {Currency.format(expense.value)}
      </TableCell>
      <TableCell component="th" scope="row">
        {updatingConfirm ? (
          <div className={classes.root}>
            <CircularProgress size={20} />
          </div>
        ) : (
          <Switch checked={expense.confirmed} onChange={toggleConfirm} />
        )}
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton component="button" onClick={() => deleteExpense(expense)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default ExpenseRow;
