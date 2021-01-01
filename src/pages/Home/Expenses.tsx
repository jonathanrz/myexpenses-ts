import React from "react";
import { Moment } from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
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

function Expenses({ month }: ExpensesProps) {
  const { query } = useExpensesQuery(month);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Expense</TableCell>
            <TableCell>Paid With</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell>Confirmed</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data &&
            query.data.map((expense: Expense) => (
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
                <TableCell>{expense.date.format("DD")}</TableCell>
                <TableCell align="right">
                  {Currency.format(expense.value)}
                </TableCell>
                <TableCell>{expense.confirmed ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default React.memo(Expenses);
