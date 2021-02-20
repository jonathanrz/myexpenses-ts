import { useMemo } from "react";
import { Moment } from "moment";
import useExpensesQuery from "queries/expenses";
import useBillsQuery from "queries/bills";
import { CategoryDataItem } from "./models";

function useMonthExpenseQuery(month: Moment) {
  const { query: expensesQuery } = useExpensesQuery(month);
  const { monthQuery: billsQuery } = useBillsQuery(month);

  const expensesMappedData = useMemo(() => {
    if (!expensesQuery.data) return [];

    return expensesQuery.data.map((expense) => ({
      id: `expense_${expense.id}`,
      date: expense.date,
      name: expense.name,
      categoryName: expense.category?.name,
      category: expense.category,
      expense: expense,
      placeName: expense.place?.name,
      place: expense.place,
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

  return {
    isLoading: expensesQuery.isLoading,
    isError: expensesQuery.isError,
    error: expensesQuery.error,
    data: [...expensesMappedData, ...billsMappedData],
  };
}

export default useMonthExpenseQuery;
