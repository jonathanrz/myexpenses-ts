import React from "react";
import cs from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Currency from "helpers/currency";

interface ValueCellProps {
  confirmed: boolean;
  receipt?: boolean;
  expense?: boolean;
  value: number;
}

const useStyles = makeStyles({
  value: {
    fontWeight: "bold",
  },
  confirmedValue: {
    fontWeight: "normal",
  },
  expense: {
    color: "red",
  },
  receipt: {
    color: "green",
  },
});

function ValueCell({ confirmed, receipt, expense, value }: ValueCellProps) {
  const classes = useStyles();

  return (
    <div
      className={cs(classes.value, {
        [classes.confirmedValue]: confirmed,
        [classes.expense]: expense,
        [classes.receipt]: receipt,
      })}
    >
      {Currency.format(value)}
    </div>
  );
}

export default ValueCell;
