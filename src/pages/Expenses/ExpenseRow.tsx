import React, { useState } from "react";
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
import PlaceCell from "components/shared/PlaceCell";
import { Expense } from "models/Expense";
import useExpensesQuery from "queries/expenses";
import Form from "./Form";

interface ExpenseRowProps {
  expense: Expense;
  deleteExpense: (id: string) => void;
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
  const { confirmMutation } = useExpensesQuery();

  function toggleConfirm() {
    setUpdatingConfirm(true);
    confirmMutation
      .mutateAsync(expense)
      .finally(() => setUpdatingConfirm(false));
  }

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={2}>
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
        {expense.name}
      </TableCell>
      <TableCell component="th" scope="row">
        <AccountCell account={expense.account} />
      </TableCell>
      <TableCell component="th" scope="row">
        <CategoryCell category={expense.category} />
      </TableCell>
      <TableCell component="th" scope="row">
        <PlaceCell place={expense.place} />
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
