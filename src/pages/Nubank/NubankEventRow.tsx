import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Currency from "helpers/currency";
import { NubankEvent } from "models/NubankEvent";
import ExpenseForm from "pages/Expenses/Form";

interface NubankEventRowProps {
  event: NubankEvent;
  onEventSaved: (event: NubankEvent) => void;
}

const useStyles = makeStyles({
  row: {
    "&:nth-of-type(even)": {
      backgroundColor: "#EEEEEE",
    },
    "&:hover": {
      backgroundColor: "#DDDDDD",
    },
  },
  expenseForm: {
    backgroundColor: "#F0F0F0",
    padding: "1rem",
  },
});

function NubankEventRow({ event, onEventSaved }: NubankEventRowProps) {
  const classes = useStyles();
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  return (
    <React.Fragment>
      <TableRow
        key={event.id}
        className={classes.row}
        onClick={() => setShowExpenseForm(!showExpenseForm)}
      >
        <TableCell>{event.id}</TableCell>
        <TableCell>{event.time.format("lll")}</TableCell>
        <TableCell>{event.description}</TableCell>
        <TableCell align="right">
          {event.details?.charges?.count || 0}
        </TableCell>
        <TableCell align="right">{Currency.format(event.amount)} </TableCell>
      </TableRow>
      {showExpenseForm && (
        <TableRow className={classes.expenseForm}>
          <TableCell colSpan={5}>
            <ExpenseForm
              nubankEvent={event}
              onExpenseSaved={() => {
                setShowExpenseForm(false);
                onEventSaved(event);
              }}
              onCancel={() => setShowExpenseForm(false)}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

export default NubankEventRow;
