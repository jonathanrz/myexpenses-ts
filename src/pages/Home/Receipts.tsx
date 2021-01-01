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
import Currency from "helpers/currency";
import { Receipt } from "models/Receipt";
import useReceiptsQuery from "queries/receipts";

interface ReceiptsProps {
  month: Moment;
}

function Receipts({ month }: ReceiptsProps) {
  const { query } = useReceiptsQuery(month);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Receipt</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell>Confirmed</TableCell>
            <TableCell />
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
                <TableCell>{receipt.date.format("DD")}</TableCell>
                <TableCell align="right">
                  {Currency.format(receipt.value)}
                </TableCell>
                <TableCell>{receipt.confirmed ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Receipts;
