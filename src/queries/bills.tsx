import moment, { Moment } from "moment";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import { Bill } from "models/Bill";
import { defaultQueryProps } from "./constants";

const MODEL_NAME = "bill";
const PATH = "bills";

function useBillsQuery(month?: Moment) {
  const queryKey = [PATH, month?.format("YYYY-MM")];
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
      },
    }
  );

  const deleteMutation = useMutation<void, Error, number>(
    (id) => axios.delete(`${PATH}/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );

  return { query, mutation, deleteMutation };
}

export default useBillsQuery;
