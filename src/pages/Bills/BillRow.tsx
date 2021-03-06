import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AccountCell from "components/shared/AccountCell";
import CategoryCell from "components/shared/CategoryCell";
import { Bill } from "models/Bill";
import Currency from "helpers/currency";
import Form from "./Form";

interface BillRowProps {
  bill: Bill;
  deleteBill: (id: number) => void;
}

function BillRow({ bill, deleteBill }: BillRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            bill={bill}
            onBillSaved={() => setEdit(false)}
            onCancel={() => setEdit(false)}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {bill.name}
      </TableCell>
      <TableCell>
        <AccountCell account={bill.account} />
      </TableCell>
      <TableCell>
        <CategoryCell category={bill.category} />
      </TableCell>
      <TableCell component="th" scope="row">
        {bill.due_day}
      </TableCell>
      <TableCell component="th" scope="row">
        {bill.init_date.format("DD/MM/yyyy")}
      </TableCell>
      <TableCell component="th" scope="row">
        {bill.end_date.format("DD/MM/yyyy")}
      </TableCell>
      <TableCell component="th" scope="row">
        {Currency.format(bill.value)}
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton component="button" onClick={() => deleteBill(bill.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default BillRow;
