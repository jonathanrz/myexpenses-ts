import moment, { Moment } from "moment";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import { Receipt } from "models/Receipt";

const MODEL_NAME = "receipt";
const PATH = "receipts";

function useReceiptsQuery(month: Moment) {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Receipt>, Error>(
    [PATH, month],
    () =>
      axios
        .get(PATH, {
          params: {
            init_date: month.startOf("month").format("YYYY-MM-DD"),
            end_date: month.endOf("month").format("YYYY-MM-DD"),
          },
        })
        .then(({ data }) =>
          data.data.map((receipt: Receipt) => ({
            ...receipt,
            date: moment(receipt.date),
          }))
        ),
    {
      refetchOnMount: false,
    }
  );

  const mutation = useMutation<Receipt, Error, Receipt>(
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

  const confirmMutation = useMutation<Receipt, Error, Receipt>(
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

export default useReceiptsQuery;
