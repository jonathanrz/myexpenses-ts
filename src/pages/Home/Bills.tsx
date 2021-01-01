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
import Currency from "helpers/currency";
import { Bill } from "models/Bill";
import useBillsQuery from "queries/bills";

interface BillsProps {
  month: Moment;
}

function Bills({ month }: BillsProps) {
  const { query } = useBillsQuery(month);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bill</TableCell>
            <TableCell>Due Day</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data &&
            query.data.map((bill: Bill) => (
              <TableRow key={bill.id}>
                <TableCell component="th" scope="row">
                  {bill.name}
                </TableCell>
                <TableCell>{bill.due_day}</TableCell>
                <TableCell align="right">
                  {Currency.format(bill.value)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Bills;
