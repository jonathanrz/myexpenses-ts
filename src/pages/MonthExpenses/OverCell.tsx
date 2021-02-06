import React from "react";
import cs from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Currency from "helpers/currency";

interface OverCellProps {
  over: number;
}

const useStyles = makeStyles({
  table: {
    padding: "1rem 2rem 2rem",
    width: "unset",
  },
  overNegative: {
    color: "red",
  },
  overPositive: {
    color: "green",
  },
});

function OverCell({ over }: OverCellProps) {
  const classes = useStyles();
  return (
    <TableCell
      align="right"
      className={cs({
        [classes.overNegative]: over < 0,
        [classes.overPositive]: over > 0,
      })}
    >
      {Currency.format(Math.abs(over))}
    </TableCell>
  );
}

export default OverCell;
