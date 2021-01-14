import { Moment } from "moment";
import useBillsQuery from "queries/bills";
import useExpensesQuery from "queries/expenses";
import useReceiptsQuery from "queries/receipts";

function useMonthTransactionsQuery(month: Moment) {
  const { monthQuery: billsQuery } = useBillsQuery(month);
  const { query: receiptsQuery } = useReceiptsQuery(month);
  const { monthQuery: expensesQuery } = useExpensesQuery(month);

  return {
    isLoading:
      billsQuery.isLoading ||
      receiptsQuery.isLoading ||
      expensesQuery.isLoading,
    isError:
      billsQuery.isError || receiptsQuery.isError || expensesQuery.isError,
    error: billsQuery.error || receiptsQuery.error || expensesQuery.error,
    bills: billsQuery.data,
    receipts: receiptsQuery.data,
    expenses: expensesQuery.data,
  };
}

export default useMonthTransactionsQuery;
