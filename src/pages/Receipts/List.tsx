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
import { Receipt } from "models/Receipt";
import useReceiptsQuery from "queries/receipts";
import Form from "./Form";
import ReceiptRow from "./ReceiptRow";

const useStyles = makeStyles({
  container: {
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
});

function ReceiptList() {
  const classes = useStyles();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const { query, deleteMutation } = useReceiptsQuery(currentMonth);

  function handleMonthSelected(event: React.ChangeEvent<{}>, newMonth: Moment) {
    setCurrentMonth(newMonth);
  }

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function deleteReceipt(receipt: Receipt) {
    if (window.confirm("Delete?")) {
      deleteMutation.mutate(receipt);
    }
  }

  return (
    <div className={classes.container}>
      <TableContainer className={classes.table} component={Paper}>
        <MonthTabs
          currentMonth={currentMonth}
          handleMonthSelected={handleMonthSelected}
        />
        <Table stickyHeader>
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
            {query.data &&
              query.data.map((receipt: Receipt) => (
                <ReceiptRow
                  key={receipt.id}
                  receipt={receipt}
                  deleteReceipt={deleteReceipt}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Receipt
        </Typography>
        <Form />
      </Paper>
    </div>
  );
}

export default ReceiptList;
