import React, { useMemo, useState } from "react";
import moment, { Moment } from "moment";
import sumBy from "lodash/sumBy";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PrivatePage from "components/PrivatePage";
import MonthTabs from "components/MonthTabs";
import Currency from "helpers/currency";
import useMonthExpenseQuery from "hooks/useMonthExpenseQuery";
import { CategoryData } from "models/CategoryData";
import MonthExpensesRow from "./MonthExpensesRow";
import OverCell from "./OverCell";

const today = moment();

const useStyles = makeStyles({
  table: {
    padding: "1rem 2rem 2rem",
    width: "unset",
  },
});

function MonthExpenses() {
  const classes = useStyles();
  const [currentMonth, setCurrentMonth] = useState(today);
  const query = useMonthExpenseQuery(currentMonth);

  const [totalValue, totalForecast] = useMemo(
    () => [sumBy(query.data, "value"), sumBy(query.data, "forecast")],
    [query.data]
  );

  function handleMonthSelected(event: React.ChangeEvent<{}>, newMonth: Moment) {
    setCurrentMonth(newMonth);
  }

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error?.message}</Alert>;

  return (
    <PrivatePage title="Month Expenses">
      <MonthTabs
        currentMonth={currentMonth}
        handleMonthSelected={handleMonthSelected}
      />
      <TableContainer className={classes.table} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Forecast</TableCell>
              <TableCell align="right">Over</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {query.data?.map((cat: CategoryData) => (
              <MonthExpensesRow
                key={cat.category?.name || "unnamed"}
                catData={cat}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell align="right">{Currency.format(totalValue)}</TableCell>
              <TableCell align="right">
                {Currency.format(totalForecast)}
              </TableCell>
              <OverCell over={totalForecast - totalValue} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </PrivatePage>
  );
}

export default MonthExpenses;
