import React, { useState } from "react";
import { Moment } from "moment";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Currency from "helpers/currency";
import { Bill } from "models/Bill";
import ExpenseForm from "pages/Expenses/Form";
import useBillsQuery from "queries/bills";

interface BillsProps {
  month: Moment;
}

interface BillRowProps {
  bill: Bill;
}

const useStyles = makeStyles({
  table: {
    height: "100%",
    width: "unset",
  },
  actionCell: {
    width: "15%",
  },
});

function BillRow({ bill }: BillRowProps) {
  const classes = useStyles();
  const [showBillForm, setShowBillForm] = useState(false);

  return (
    <React.Fragment>
      <TableRow key={bill.id}>
        <TableCell component="th" scope="row">
          {bill.name}
        </TableCell>
        <TableCell>{bill.due_day}</TableCell>
        <TableCell>{Currency.format(bill.value)}</TableCell>
        <TableCell align="right" className={classes.actionCell}>
          <IconButton
            color="default"
            size="small"
            onClick={() => setShowBillForm(!showBillForm)}
          >
            {showBillForm ? <ClearIcon /> : <AddIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      {showBillForm && (
        <TableRow>
          <TableCell colSpan={4}>
            <ExpenseForm
              bill={bill}
              onExpenseSaved={() => setShowBillForm(false)}
              onCancel={() => setShowBillForm(false)}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

function Bills({ month }: BillsProps) {
  const classes = useStyles();
  const { monthQuery: query } = useBillsQuery(month);

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bill</TableCell>
            <TableCell>Due Day</TableCell>
            <TableCell>Value</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data?.map((bill: Bill) => (
            <BillRow key={bill.id} bill={bill} />
          ))}
          {query.data?.length === 0 ? (
            <TableRow>
              <TableCell>No more bills for this month</TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Bills;
