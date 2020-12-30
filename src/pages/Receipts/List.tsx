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
import { Receipt } from "models/Receipt";
import useReceiptsQuery from "queries/receipts";
import Form from "./Form";
import ReceiptRow from "./ReceiptRow";

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

const currentMonth = moment();

function ReceiptList() {
  const classes = useStyles();
  const { query, deleteMutation } = useReceiptsQuery(currentMonth);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function deleteReceipt(id: string) {
    if (window.confirm("Delete?")) {
      deleteMutation.mutate(id);
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
