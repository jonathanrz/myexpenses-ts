import moment, { Moment } from "moment";
import useAxios from "hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Expense } from "models/Expense";
import { ExpenseParams } from "models/ExpenseParams";
import { defaultQueryProps } from "./constants";
import {
  queryKeyFunction as billQueryKeyFunction,
  monthQueryKeyFunction as billMonthQueryKeyFunction,
} from "./bills";

const MODEL_NAME = "expense";
const PATH = "expenses";

const queryKeyFunction = (date: Moment) => [PATH, date.format("YYYY-MM")];
const monthQueryKeyFunction = (date: Moment) => [
  ...queryKeyFunction(date),
  "month",
];

function useExpensesQuery(month: Moment) {
  const queryClient = useQueryClient();
  const axios = useAxios();

  function invalidateQueries(expense: Expense) {
    const date = moment(expense.date);

    queryClient.invalidateQueries(queryKeyFunction(date));
    queryClient.invalidateQueries(monthQueryKeyFunction(date));
    queryClient.invalidateQueries("accounts");

    if (expense.bill) {
      queryClient.invalidateQueries(billQueryKeyFunction(date));
      queryClient.invalidateQueries(billMonthQueryKeyFunction(date));
    }
  }

  const query = useQuery<Array<Expense>, Error>(
    queryKeyFunction(month),
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
    monthQueryKeyFunction(month),
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

  const mutation = useMutation<Expense, Error, ExpenseParams>(
    (values) => {
      if (values.id) {
        return axios
          .patch(`/${PATH}/${values.id}`, {
            [MODEL_NAME]: {
              ...values,
              installmentNumber: values.installmentNumber || null,
            },
          })
          .then(({ data }) => data.data);
      }
      return axios
        .post(`/${PATH}`, {
          [MODEL_NAME]: {
            ...values,
            installmentNumber: values.installmentNumber
              ? Number.parseInt(values.installmentNumber)
              : null,
          },
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

export { queryKeyFunction, monthQueryKeyFunction };
export default useExpensesQuery;
