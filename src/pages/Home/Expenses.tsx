import React from "react";
import { Moment } from "moment";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
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
  valueSum: {
    color: "black",
    fontWeight: "bold",
    fontSize: "14px",
  },
});

function Expenses({ month }: ExpensesProps) {
  const classes = useStyles();
  const { query } = useExpensesQuery(month);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  console.log({ query });

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Expense</TableCell>
            <TableCell>Paid With</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="center">Confirmed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data?.map((expense: Expense) => (
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
              <TableCell align="right">
                {Currency.format(expense.value)}
              </TableCell>
              <TableCell align="center">
                {expense.confirmed ? "Yes" : "No"}
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
