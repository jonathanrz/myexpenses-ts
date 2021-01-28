import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import moment, { Moment } from "moment";
import {
  queryKeyFunction as expensesQueryKeyFunction,
  monthQueryKeyFunction as expensesMonthQueryKeyFunction,
} from "./expenses";
import { Expense } from "models/Expense";
import { defaultQueryProps } from "./constants";

function useCreditCardsInvoiceQuery(month: Moment, creditCardId: String) {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Expense>, Error>(
    `credit_card_invoice_${creditCardId}_${month.format("YYYY-MM")}`,
    () =>
      axios
        .get("/expenses/get_credit_card_invoice", {
          params: {
            month: month.format("YYYY-MM"),
            credit_card_id: creditCardId,
          },
        })
        .then(({ data }) =>
          data.data.map((expense: Expense) => ({
            ...expense,
            date: moment(expense.date),
          }))
        ),
    defaultQueryProps
  );

  const generateInvoiceMutation = useMutation<Expense, Error, String>(
    (creditCardId) =>
      axios
        .post(
          `/expenses/generate_credit_card_invoice?month=${month.format(
            "YYYY-MM"
          )}&credit_card_id=${creditCardId}`
        )
        .then(({ data }) => data.data),
    {
      onSuccess: (expense) => {
        queryClient.invalidateQueries(
          expensesQueryKeyFunction(moment(expense.date))
        );
        queryClient.invalidateQueries(
          expensesMonthQueryKeyFunction(moment(expense.date))
        );
      },
    }
  );

  return { query, generateInvoiceMutation };
}

export default useCreditCardsInvoiceQuery;
