import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CategoryCell from "components/shared/CategoryCell";
import PlaceCell from "components/shared/PlaceCell";
import Currency from "helpers/currency";
import { Expense } from "models/Expense";

interface CreditCardsInvoiceRowProps {
  expense: Expense;
}

const useStyles = makeStyles({
  tableRowSelected: {
    backgroundColor: "#64dd17",
  },
});

function CreditCardsInvoiceRow({ expense }: CreditCardsInvoiceRowProps) {
  const classes = useStyles();
  const [selected, setSelected] = useState(false);

  return (
    <TableRow
      key={expense.id}
      className={selected ? classes.tableRowSelected : ""}
      onClick={() => setSelected(!selected)}
    >
      <TableCell component="th" scope="row">
        {expense.installmentNumber
          ? `${expense.name} ${expense.installmentNumber}/${expense.installmentCount}`
          : expense.name}
      </TableCell>
      <TableCell component="th" scope="row">
        <CategoryCell category={expense.category} />
      </TableCell>
      <TableCell component="th" scope="row">
        <PlaceCell place={expense.place} />
      </TableCell>
      <TableCell component="th" scope="row">
        {expense.date.format("DD/MM/yyyy")}
      </TableCell>
      <TableCell component="th" scope="row">
        {Currency.format(expense.value)}
      </TableCell>
    </TableRow>
  );
}

export default CreditCardsInvoiceRow;
