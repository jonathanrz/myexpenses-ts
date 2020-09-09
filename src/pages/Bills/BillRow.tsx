import React, { useState } from "react";
import { AxiosInstance } from "axios";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Currency from "../../helpers/currency";
import Form from "./Form";
import { Bill } from "./model";

interface BillRowProps {
  bill: Bill;
  axios: AxiosInstance;
  onBillSaved: () => void;
  deleteBill: (id: string) => void;
}

function BillRow({ bill, axios, onBillSaved, deleteBill }: BillRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            axios={axios}
            bill={bill}
            onBillSaved={() => {
              setEdit(false);
              onBillSaved();
            }}
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
