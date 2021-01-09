import moment, { Moment } from "moment";
import useAxios from "hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Expense } from "models/Expense";
import { defaultQueryProps } from "./constants";
import {
  queryKeyFunction as billQueryKeyFunction,
  monthQueryKeyFunction as billMonthQueryKeyFunction,
} from "./bills";

const MODEL_NAME = "expense";
const PATH = "expenses";

function useExpensesQuery(month: Moment) {
  const queryKey = (date: Moment) => [PATH, date.format("YYYY-MM")];
  const monthQueryKey = (date: Moment) => [...queryKey(date), "month"];
  const queryClient = useQueryClient();
  const axios = useAxios();

  function invalidateQueries(expense: Expense) {
    const date = moment(expense.date);

    queryClient.invalidateQueries(queryKey(date));
    queryClient.invalidateQueries(monthQueryKey(date));

    if (expense.bill) {
      queryClient.invalidateQueries(billQueryKeyFunction(date));
      queryClient.invalidateQueries(billMonthQueryKeyFunction(date));
    }
  }

  const query = useQuery<Array<Expense>, Error>(
    queryKey(month),
    () =>
      axios
        .get(PATH, {
          params: {
            init_date: month.startOf("month").format("YYYY-MM-DD"),
            end_date: month.endOf("month").format("YYYY-MM-DD"),
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

  const monthQuery = useQuery<Array<Expense>, Error>(
    monthQueryKey(month),
    () =>
      axios
        .get(`${PATH}/month`, {
          params: {
            month: month.startOf("month").format("YYYY-MM"),
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

  const mutation = useMutation<Expense, Error, Expense>(
    (values) => {
      if (values.id) {
        return axios
          .patch(`/${PATH}/${values.id}`, {
            [MODEL_NAME]: { installmentNumber: null, ...values },
          })
          .then(({ data }) => data.data);
      }
      return axios
        .post(`/${PATH}`, {
          [MODEL_NAME]: { installmentNumber: null, ...values },
        })
        .then(({ data }) => data.data);
    },
    {
      onSuccess: invalidateQueries,
    }
  );

  const deleteMutation = useMutation<Expense, Error, Expense>(
    (expense) => axios.delete(`${PATH}/${expense.id}`).then(() => expense),
    {
      onSuccess: invalidateQueries,
    }
  );

  const confirmMutation = useMutation<Expense, Error, Expense>(
    (expense) => {
      const path = `/${PATH}/${expense.id}/${
        expense.confirmed ? "unconfirm" : "confirm"
      }`;

      return axios.post(path).then(() => expense);
    },
    {
      onSuccess: invalidateQueries,
    }
  );

  return { query, monthQuery, mutation, deleteMutation, confirmMutation };
}

export default useExpensesQuery;
