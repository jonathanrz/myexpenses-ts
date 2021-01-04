import React, { useMemo } from "react";
import { Moment } from "moment";
import cs from "classnames";
import sortBy from "lodash/sortBy";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
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
  value: {
    color: "green",
    fontWeight: "bold",
  },
  confirmedValue: {
    fontWeight: "normal",
  },
  valueSum: {
    color: "black",
    fontWeight: "bold",
    fontSize: "14px",
  },
});

function Receipts({ month }: ReceiptsProps) {
  const classes = useStyles();
  const { query } = useReceiptsQuery(month);

  const receipts = useMemo(
    () => sortBy(query.data || [], ["confirmed", "date", "name"]),
    [query.data]
  );

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
          </TableRow>
        </TableHead>
        <TableBody>
          {receipts.map((receipt: Receipt) => (
            <TableRow key={receipt.id}>
              <TableCell component="th" scope="row">
                {receipt.name}
              </TableCell>
              <TableCell>
                <AccountCell account={receipt.account} />
              </TableCell>
              <TableCell align="center">{receipt.date.format("DD")}</TableCell>
              <TableCell
                align="right"
                className={cs(classes.value, {
                  [classes.confirmedValue]: receipt.confirmed,
                })}
              >
                {Currency.format(receipt.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell align="right" className={classes.valueSum}>
              {Currency.format(
                query.data?.reduce((acc, receipt) => acc + receipt.value, 0) ||
                  0
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default Receipts;
