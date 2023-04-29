import React, { useMemo, useState } from "react";
import moment, { Moment } from "moment";
import { useParams } from "react-router-dom";
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
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import MonthTabs from "components/MonthTabs";
import AccountSelect from "components/shared/AccountSelect";
import BillSelect from "components/shared/BillSelect";
import CategorySelect from "components/shared/CategorySelect";
import { Expense } from "models/Expense";
import useSetState from "hooks/useSetState";
import useExpensesQuery from "queries/expenses";
import Form from "./Form";
import ExpenseRow from "./ExpenseRow";

const useStyles = makeStyles({
  container: {
    display: "grid",
  },
  containerWithForm: {
    gridTemplateColumns: "1150px 400px",
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
  tableNameHeader: {
    display: "flex",
  },
});

interface ExpenseListParams {
  mode: string;
}

const today = moment();

function ExpenseList() {
  const classes = useStyles();
  const [currentMonth, setCurrentMonth] = useState(today);
  const { query, deleteMutation } = useExpensesQuery(currentMonth);
  const [filter, setFilter] = useSetState({
    name: "",
    accountId: "",
    billId: "",
    categoryId: "",
  });

  const { mode } = useParams<ExpenseListParams>();
  const showForm = mode === "form";

  const filteredData = useMemo(() => {
    return query.data?.filter((expense) => {
      let valid = true;
      if (valid && filter.name) valid = expense.name.includes(filter.name);
      if (valid && filter.accountId)
        valid = expense.account?.id === filter.accountId;
      if (valid && filter.billId)
        valid = expense.bill?.id === parseInt(filter.billId);
      if (valid && filter.categoryId)
        valid = expense.category?.id === filter.categoryId;

      return valid;
    });
  }, [query.data, filter]);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function deleteExpense(expense: Expense) {
    if (window.confirm("Delete?")) {
      deleteMutation.mutate(expense);
    }
  }

  function handleMonthSelected(event: React.ChangeEvent<{}>, newMonth: Moment) {
    setCurrentMonth(newMonth);
  }

  return (
    <div className={showForm ? classes.containerWithForm : classes.container}>
      <TableContainer className={classes.table} component={Paper}>
        <MonthTabs
          currentMonth={currentMonth}
          handleMonthSelected={handleMonthSelected}
        />
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  <TextField
                    label="Name"
                    value={filter.name}
                    onChange={(e) => setFilter({ name: e.target.value })}
                    fullWidth
                  />
                </FormControl>
              </TableCell>
              <TableCell>
                <AccountSelect
                  value={filter.accountId}
                  handleChange={(e) =>
                    setFilter({ accountId: e.target.value as string })
                  }
                />
              </TableCell>
              <TableCell>
                <CategorySelect
                  value={filter.categoryId}
                  handleChange={(categoryId) => setFilter({ categoryId })}
                />
              </TableCell>
              <TableCell>
                <BillSelect
                  value={filter.billId}
                  handleChange={(billId) => setFilter({ billId })}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Confirmed</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((expense: Expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                deleteExpense={deleteExpense}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showForm && (
        <Paper className={classes.formContainer}>
          <Typography component="h1" variant="h5">
            New Expense
          </Typography>
          <Form />
        </Paper>
      )}
    </div>
  );
}

export default ExpenseList;
