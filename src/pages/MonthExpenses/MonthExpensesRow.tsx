import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import Currency from "helpers/currency";
import { renderExpenseName } from "helpers/expense";
import { CategoryData } from "./models";
import OverCell from "./OverCell";

interface MonthExpensesRowProps {
  catData: CategoryData;
}

const useStyles = makeStyles({
  table: {
    padding: "1rem 2rem 2rem",
    width: "unset",
  },
});

function MonthExpensesRow({ catData }: MonthExpensesRowProps) {
  const [showExpenses, setShowExpenses] = useState(false);
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableRow onClick={() => setShowExpenses(!showExpenses)}>
        <TableCell>{catData.categoryName}</TableCell>
        <TableCell align="right">{Currency.format(catData.value)}</TableCell>
        <TableCell align="right">{Currency.format(catData.forecast)}</TableCell>
        <OverCell over={catData.forecast - catData.value} />
      </TableRow>
      {showExpenses && (
        <div className={classes.table}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Expense</TableCell>
                <TableCell>Place</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {catData.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{renderExpenseName(expense)}</TableCell>
                  <TableCell>{expense.place?.name}</TableCell>
                  <TableCell align="right">
                    {Currency.format(expense.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </React.Fragment>
  );
}

export default MonthExpensesRow;
