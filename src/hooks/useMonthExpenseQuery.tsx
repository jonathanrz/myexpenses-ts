import { useMemo } from "react";
import { Moment } from "moment";
import findIndex from "lodash/findIndex";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import sumBy from "lodash/sumBy";
import useExpensesQuery from "queries/expenses";
import useBillsQuery from "queries/bills";
import useCategoriesQuery from "queries/categories";
import { CategoryData } from "models/CategoryData";
import { CategoryDataItem } from "models/CategoryDataItem";

function useMonthExpenseQuery(month: Moment) {
  const { query: expensesQuery } = useExpensesQuery(month);
  const { monthQuery: billsQuery } = useBillsQuery(month);
  const { query: categoriesQuery } = useCategoriesQuery();

  const expensesMappedData = useMemo(() => {
    if (!expensesQuery.data) return [];

    return expensesQuery.data.map((expense) => ({
      id: `expense_${expense.id}`,
      date: expense.date,
      name: expense.name,
      categoryName: expense.category?.name,
      category: expense.category,
      expense: expense,
      value: expense.value,
    })) as Array<CategoryDataItem>;
  }, [expensesQuery.data]);

  const billsMappedData = useMemo(() => {
    if (!billsQuery.data) return [];

    return billsQuery.data.map((bill) => ({
      id: `bill_${bill.id}`,
      name: `${bill.name} (bill)`,
      categoryName: bill.category?.name,
      category: bill.category,
      placeName: "No Place",
      value: bill.value,
    })) as Array<CategoryDataItem>;
  }, [billsQuery.data]);

  const groupedByCategory = useMemo(() => {
    const data = [...expensesMappedData, ...billsMappedData];
    const grouped = groupBy(
      data.filter(
        (e) =>
          (!e.category || e.category?.display_in_month_expense) &&
          !(e.name.startsWith("Fatura") || e.name.startsWith("invoice"))
      ) || [],
      "categoryName"
    );

    let result: Array<CategoryData> = [];

    Object.values(grouped).forEach((value: Array<CategoryDataItem>) => {
      result.push({
        categoryName: value[0].category?.name || "Unnamed",
        category: value[0].category,
        items: orderBy(value, ["placeName", "date"]),
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
  }, [expensesMappedData, billsMappedData, categoriesQuery.data]);

  return {
    isLoading:
      expensesQuery.isLoading ||
      billsQuery.isLoading ||
      categoriesQuery.isLoading,
    isError:
      expensesQuery.isError || billsQuery.isError || categoriesQuery.isError,
    error: expensesQuery.error || billsQuery.error || categoriesQuery.error,
    data: groupedByCategory,
    month,
  };
}

export default useMonthExpenseQuery;
