import moment, { Moment } from "moment";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import { Bill } from "models/Bill";
import { defaultQueryProps } from "./constants";

const MODEL_NAME = "bill";
const PATH = "bills";

const queryKeyFunction = (month?: Moment) => [PATH, month?.format("YYYY-MM")];
const monthQueryKeyFunction = (month?: Moment) => [
  ...queryKeyFunction(month),
  "month",
];

function useBillsQuery(month?: Moment) {
  const queryKey = queryKeyFunction(month);
  const monthQueryKey = monthQueryKeyFunction(month);
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Bill>, Error>(
    queryKey,
    () =>
      axios
        .get(PATH, {
          params: {
            month: month?.startOf("month").format("YYYY-MM-DD"),
          },
        })
        .then(({ data }) =>
          data.data.map((bill: Bill) => ({
            ...bill,
            init_date: moment(bill.init_date),
            end_date: moment(bill.end_date),
          }))
        ),
    defaultQueryProps
  );

  const monthQuery = useQuery<Array<Bill>, Error>(
    monthQueryKey,
    () => {
      if (!month) return Promise.resolve([]);

      return axios
        .get(`${PATH}/month`, {
          params: {
            month: month?.format("YYYY-MM"),
          },
        })
        .then(({ data }) =>
          data.data.map((bill: Bill) => ({
            ...bill,
            init_date: moment(bill.init_date),
            end_date: moment(bill.end_date),
          }))
        );
    },
    defaultQueryProps
  );

  const mutation = useMutation<Bill, Error, Bill>(
    (values) => {
      if (values.id) {
        return axios
          .patch(`/${PATH}/${values.id}`, {
            [MODEL_NAME]: {
              ...values,
              init_date: values.init_date.toISOString(),
              end_date: values.end_date.toISOString(),
            },
          })
          .then(({ data }) => data.data);
      }
      return axios
        .post(`/${PATH}`, { [MODEL_NAME]: values })
        .then(({ data }) => data.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        queryClient.invalidateQueries(monthQueryKey);
      },
    }
  );

  const deleteMutation = useMutation<void, Error, number>(
    (id) => axios.delete(`${PATH}/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        queryClient.invalidateQueries(monthQueryKey);
      },
    }
  );

  return { query, monthQuery, mutation, deleteMutation };
}

export { queryKeyFunction, monthQueryKeyFunction };
export default useBillsQuery;
