import React, { useMemo, useState } from "react";
import { Moment } from "moment";
import cs from "classnames";
import sortBy from "lodash/sortBy";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AccountCell from "components/shared/AccountCell";
import CreditCardCell from "components/shared/CreditCardCell";
import Currency from "helpers/currency";
import { Expense } from "models/Expense";
import useExpensesQuery from "queries/expenses";

interface ExpensesProps {
  month: Moment;
}

const useStyles = makeStyles({
  table: {
    height: "100%",
    width: "unset",
  },
  actionCell: {
    width: "15%",
  },
  value: {
    color: "red",
    fontWeight: "bold",
  },
  confirmedValue: {
    fontWeight: "normal",
  },
  valueSum: {
    color: "black",
    fontWeight: "bold",
    fontSize: "14px",
  },
});

function Expenses({ month }: ExpensesProps) {
  const classes = useStyles();
  const [confirming, setConfirming] = useState(false);
  const { monthQuery: query, confirmMutation } = useExpensesQuery(month);

  const expenses = useMemo(
    () => sortBy(query.data || [], ["confirmed", "date", "name"]),
    [query.data]
  );

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function confirm(expense: Expense) {
    setConfirming(true);

    confirmMutation.mutateAsync(expense).finally(() => setConfirming(false));
  }

  function renderConfirmButton(expense: Expense) {
    if (confirming) return <CircularProgress />;

    return (
      <IconButton color="default" size="small" onClick={() => confirm(expense)}>
        {expense.confirmed ? <ClearIcon /> : <DoneIcon />}
      </IconButton>
    );
  }

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Expense</TableCell>
            <TableCell>Paid With</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell className={classes.actionCell} />
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense: Expense) => (
            <TableRow key={expense.id}>
              <TableCell component="th" scope="row">
                {expense.name}
              </TableCell>
              <TableCell>
                {expense.account ? (
                  <AccountCell account={expense.account} />
                ) : (
                  <CreditCardCell creditCard={expense.credit_card} />
                )}
              </TableCell>
              <TableCell align="center">{expense.date.format("DD")}</TableCell>
              <TableCell
                align="right"
                className={cs(classes.value, {
                  [classes.confirmedValue]: expense.confirmed,
                })}
              >
                {Currency.format(expense.value)}
              </TableCell>
              <TableCell align="right" className={classes.actionCell}>
                {expense.account ? renderConfirmButton(expense) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell align="right" className={classes.valueSum}>
              {Currency.format(
                query.data?.reduce((acc, expense) => acc + expense.value, 0) ||
                  0
              )}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default React.memo(Expenses);
