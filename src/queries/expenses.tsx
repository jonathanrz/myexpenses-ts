import moment, { Moment } from "moment";
import useAxios from "hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Expense } from "models/Expense";

const MODEL_NAME = "expense";
const PATH = "expenses";

function useExpensesQuery(month: Moment) {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Expense>, Error>([PATH, month], () =>
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
      )
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
      onSuccess: () => {
        queryClient.invalidateQueries([PATH, month]);
      },
    }
  );

  const deleteMutation = useMutation<void, Error, String>(
    (id) => axios.delete(`${PATH}/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PATH, month]);
      },
    }
  );

  const confirmMutation = useMutation<Expense, Error, Expense>(
    (receipt) => {
      const path = `/${PATH}/${receipt.id}/${
        receipt.confirmed ? "unconfirm" : "confirm"
      }`;

      return axios.post(path);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PATH, month]);
      },
    }
  );

  return { query, mutation, deleteMutation, confirmMutation };
}

export default useExpensesQuery;
