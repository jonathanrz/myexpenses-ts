import moment, { Moment } from "moment";
import useAxios from "hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Expense } from "models/Expense";
import { defaultQueryProps } from "./constants";

const MODEL_NAME = "expense";
const PATH = "expenses";

function useExpensesQuery(month: Moment) {
  const queryKey = (date: Moment) => [PATH, date.format("YYYY-MM")];
  const monthQueryKey = (date: Moment) => [...queryKey(date), "month"];
  const queryClient = useQueryClient();
  const axios = useAxios();

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
      onSuccess: (expense) => {
        queryClient.invalidateQueries(queryKey(moment(expense.date)));
        queryClient.invalidateQueries(monthQueryKey(moment(expense.date)));
      },
    }
  );

  const deleteMutation = useMutation<Expense, Error, Expense>(
    (expense) => axios.delete(`${PATH}/${expense.id}`).then(() => expense),
    {
      onSuccess: (expense) => {
        queryClient.invalidateQueries(queryKey(moment(expense.date)));
        queryClient.invalidateQueries(monthQueryKey(moment(expense.date)));
      },
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
      onSuccess: (expense) => {
        queryClient.invalidateQueries(queryKey(moment(expense.date)));
        queryClient.invalidateQueries(monthQueryKey(moment(expense.date)));
      },
    }
  );

  return { query, monthQuery, mutation, deleteMutation, confirmMutation };
}

export default useExpensesQuery;
