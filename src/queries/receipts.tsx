import moment, { Moment } from "moment";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import { Receipt } from "models/Receipt";
import { defaultQueryProps } from "./constants";

const MODEL_NAME = "receipt";
const PATH = "receipts";

function useReceiptsQuery(month: Moment) {
  const queryKey = (date: Moment) => [PATH, date.format("YYYY-MM")];
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Receipt>, Error>(
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
          data.data.map((receipt: Receipt) => ({
            ...receipt,
            date: moment(receipt.date),
          }))
        ),
    defaultQueryProps
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
      onSuccess: (receipt: Receipt) => {
        queryClient.invalidateQueries(queryKey(moment(receipt.date)));
      },
    }
  );

  const deleteMutation = useMutation<Receipt, Error, Receipt>(
    (receipt) => axios.delete(`${PATH}/${receipt.id}`).then(() => receipt),
    {
      onSuccess: (receipt) => {
        queryClient.invalidateQueries(queryKey(moment(receipt.date)));
      },
    }
  );

  const confirmMutation = useMutation<Receipt, Error, Receipt>(
    (receipt) => {
      const path = `/${PATH}/${receipt.id}/${
        receipt.confirmed ? "unconfirm" : "confirm"
      }`;

      return axios.post(path).then(() => receipt);
    },
    {
      onSuccess: (receipt) => {
        queryClient.invalidateQueries(queryKey(moment(receipt.date)));
        queryClient.invalidateQueries("accounts");
      },
    }
  );

  return { query, mutation, deleteMutation, confirmMutation };
}

export default useReceiptsQuery;
