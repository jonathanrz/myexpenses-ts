import React, { useState } from "react";
import moment, { Moment } from "moment";
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
import MonthTabs from "components/MonthTabs";
import { Bill } from "models/Bill";
import useBillsQuery from "queries/bills";
import Form from "./Form";
import BillRow from "./BillRow";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "750px 350px",
    display: "grid",
    gridGap: "2rem",
  },
  formContainer: {
    padding: "1rem",
  },
  table: {
    padding: "1rem 2rem 2rem",
    width: "unset",
  },
});

function BillsList() {
  const classes = useStyles();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const { query, deleteMutation } = useBillsQuery(currentMonth);

  function handleMonthSelected(event: React.ChangeEvent<{}>, newMonth: Moment) {
    setCurrentMonth(newMonth);
  }

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function deleteBill(id: number) {
    if (window.confirm("Delete?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className={classes.container}>
      <TableContainer className={classes.table} component={Paper}>
        <MonthTabs
          currentMonth={currentMonth}
          handleMonthSelected={handleMonthSelected}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Due Day</TableCell>
              <TableCell>Init Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Value</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {query.data &&
              query.data.map((bill: Bill) => (
                <BillRow key={bill.id} bill={bill} deleteBill={deleteBill} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Bill
        </Typography>
        <Form />
      </Paper>
    </div>
  );
}

export default BillsList;
