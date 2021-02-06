import React, { useMemo, useState } from "react";
import moment, { Moment } from "moment";
import findIndex from "lodash/findIndex";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
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
import useMonthExpenseQuery from "./useMonthExpenseQuery";
import useCategoriesQuery from "queries/categories";
import MonthExpensesRow from "./MonthExpensesRow";
import { CategoryData, CategoryDataItem } from "./models";
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
  const { query: categoriesQuery } = useCategoriesQuery();

  const groupedByCategory = useMemo(() => {
    const grouped = groupBy(
      query.data?.filter(
        (e) =>
          (!e.category || e.category?.display_in_month_expense) &&
          ![
            "Fatura Nubank",
            "Fatura C6",
            "invoice Nubank",
            "invoice C6",
          ].includes(e.name)
      ) || [],
      "categoryName"
    );

    let result: Array<CategoryData> = [];

    Object.values(grouped).forEach((value: Array<CategoryDataItem>) => {
      result.push({
        categoryName: value[0].category?.name || "Unnamed",
        category: value[0].category,
        items: sortBy(value, (item) => item.place?.name || "no place"),
        value: sumBy(value, "value"),
        forecast: value[0].category?.forecast || 0,
      });
    });

    if (categoriesQuery.data) {
      categoriesQuery.data
        .filter(
          (cat) =>
            cat.display_in_month_expense &&
            findIndex(result, (r) => r.category?.id === cat.id) === -1
        )
        .forEach((cat) => {
          result.push({
            categoryName: cat.name,
            category: cat,
            items: [],
            value: 0,
            forecast: cat.forecast || 0,
          });
        });
    }

    return sortBy(result, "categoryName");
  }, [query.data, categoriesQuery.data]);

  const [totalValue, totalForecast] = useMemo(
    () => [
      sumBy(groupedByCategory, "value"),
      sumBy(groupedByCategory, "forecast"),
    ],
    [groupedByCategory]
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
            {groupedByCategory.map((cat) => (
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
