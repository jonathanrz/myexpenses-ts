import React from "react";
import { Moment } from "moment";
import { makeStyles } from "@material-ui/core/styles";
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
import Currency from "helpers/currency";
import { Receipt } from "models/Receipt";
import useReceiptsQuery from "queries/receipts";

interface ReceiptsProps {
  month: Moment;
}

const useStyles = makeStyles({
  table: {
    height: "100%",
    width: "unset",
  },
});

function Receipts({ month }: ReceiptsProps) {
  const classes = useStyles();
  const { query } = useReceiptsQuery(month);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Receipt</TableCell>
            <TableCell>Account</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="center">Confirmed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data &&
            query.data.map((receipt: Receipt) => (
              <TableRow key={receipt.id}>
                <TableCell component="th" scope="row">
                  {receipt.name}
                </TableCell>
                <TableCell>
                  <AccountCell account={receipt.account} />
                </TableCell>
                <TableCell align="center">
                  {receipt.date.format("DD")}
                </TableCell>
                <TableCell align="right">
                  {Currency.format(receipt.value)}
                </TableCell>
                <TableCell align="center">
                  {receipt.confirmed ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Receipts;
