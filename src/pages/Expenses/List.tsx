import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import useAxios from "../../hooks/useAxios";
import useAsync from "../../hooks/useAsync";
import Form from "./Form";
import ExpenseRow from "./ExpenseRow";
import { Expense } from "./model";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "800px 350px",
    display: "grid",
    gridGap: "2rem",
  },
  formContainer: {
    padding: "1rem 2rem 2rem",
  },
  table: {
    padding: "1rem 2rem 2rem",
    width: "unset",
  },
});

function ExpenseList() {
  const classes = useStyles();

  const axios = useAxios();
  const dataAsync = useAsync(() => {
    return axios.get("expenses").then(({ data }) =>
      data.data.map((expense: Expense) => ({
        ...expense,
        date: moment(expense.date),
      }))
    );
  });

  const accountsAsync = useAsync(() => {
    return axios.get("accounts").then(({ data }) => data.data);
  });

  if (dataAsync.pending) return <CircularProgress />;
  if (dataAsync.error) return <Alert severity="error">{dataAsync.error}</Alert>;

  const onExpenseSaved = () => dataAsync.execute();
  const onExpenseUpdated = (expense: Expense) => {
    dataAsync.setResult(
      dataAsync.result.map((cache: Expense) => {
        if (cache.id === expense.id) {
          return expense;
        } else {
          return cache;
        }
      })
    );
  };

  function deleteExpense(id: string) {
    if (window.confirm("Delete?")) {
      axios
        .delete(`expenses/${id}`)
        .then(() => dataAsync.execute())
        .catch(console.error);
    }
  }

  return (
    <div className={classes.container}>
      <TableContainer className={classes.table} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Confirmed</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {dataAsync.result.map((expense: Expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                accountsAsync={accountsAsync}
                axios={axios}
                onExpenseSaved={onExpenseSaved}
                onExpenseUpdated={onExpenseUpdated}
                deleteExpense={deleteExpense}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Expense
        </Typography>
        <Form
          axios={axios}
          accountsAsync={accountsAsync}
          onExpenseSaved={onExpenseSaved}
        />
      </Paper>
    </div>
  );
}

export default ExpenseList;
