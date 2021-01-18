import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import moment from "moment";
import {
  queryKeyFunction as expensesQueryKeyFunction,
  monthQueryKeyFunction as expensesMonthQueryKeyFunction,
} from "./expenses";
import { CreditCard } from "models/CreditCard";
import { Expense } from "models/Expense";
import { defaultQueryProps } from "./constants";

const MODEL_NAME = "credit_card";
const PATH = "credit_cards";

function useCreditCardsQuery() {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<CreditCard>, Error>(
    PATH,
    () => axios.get(PATH).then(({ data }) => data.data),
    defaultQueryProps
  );

  const mutation = useMutation<CreditCard, Error, CreditCard>(
    (values) => {
      if (values.id) {
        return axios
          .patch(`/${PATH}/${values.id}`, { [MODEL_NAME]: values })
          .then(({ data }) => data.data);
      }
      return axios
        .post(`/${PATH}`, { [MODEL_NAME]: values })
        .then(({ data }) => data.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PATH);
      },
    }
  );

  const deleteMutation = useMutation<void, Error, String>(
    (id) => axios.delete(`${PATH}/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PATH);
      },
    }
  );

  const generateInvoiceMutation = useMutation<Expense, Error, CreditCard>(
    (values) =>
      axios
        .post(
          `/expenses/generate_credit_card_invoice?month=${moment().format(
            "YYYY-MM"
          )}&credit_card_id=${values.id}`
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

  return { query, mutation, deleteMutation, generateInvoiceMutation };
}

export default useCreditCardsQuery;
