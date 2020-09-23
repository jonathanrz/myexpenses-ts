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
import ReceiptRow from "./ReceiptRow";
import { Receipt } from "./model";

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

function ReceiptList() {
  const classes = useStyles();

  const axios = useAxios();
  const dataAsync = useAsync(() => {
    return axios.get("receipts").then(({ data }) =>
      data.data.map((receipt: Receipt) => ({
        ...receipt,
        date: moment(receipt.date),
      }))
    );
  });

  const accountsAsync = useAsync(() => {
    return axios.get("accounts").then(({ data }) => data.data);
  });

  if (dataAsync.pending) return <CircularProgress />;
  if (dataAsync.error) return <Alert severity="error">{dataAsync.error}</Alert>;

  const onReceiptSaved = () => dataAsync.execute();
  const onReceiptUpdated = (receipt: Receipt) => {
    dataAsync.setResult(
      dataAsync.result.map((cache: Receipt) => {
        if (cache.id === receipt.id) {
          return receipt;
        } else {
          return cache;
        }
      })
    );
  };

  function deleteReceipt(id: string) {
    if (window.confirm("Delete?")) {
      axios
        .delete(`receipts/${id}`)
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
            {dataAsync.result.map((receipt: Receipt) => (
              <ReceiptRow
                key={receipt.id}
                receipt={receipt}
                accountsAsync={accountsAsync}
                axios={axios}
                onReceiptSaved={onReceiptSaved}
                onReceiptUpdated={onReceiptUpdated}
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
        <Form
          axios={axios}
          accountsAsync={accountsAsync}
          onReceiptSaved={onReceiptSaved}
        />
      </Paper>
    </div>
  );
}

export default ReceiptList;
