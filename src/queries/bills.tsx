import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "../hooks/useAxios";
import { Bill } from "../models/Bill";

function BillsQueries() {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Bill>, Error>("bills", () =>
    axios.get("bills").then(({ data }) =>
      data.data.map((bill: Bill) => ({
        ...bill,
        init_date: moment(bill.init_date),
        end_date: moment(bill.end_date),
      }))
    )
  );

  const mutation = useMutation<Bill, Error, Bill>(
    (values) => {
      if (values.id) {
        return axios
          .patch(`/bills/${values.id}`, {
            bill: {
              ...values,
              init_date: values.init_date.toISOString(),
              end_date: values.end_date.toISOString(),
            },
          })
          .then(({ data }) => data.data);
      }
      return axios
        .post("/bills", { bill: values })
        .then(({ data }) => data.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("bills");
      },
    }
  );

  const deleteMutation = useMutation<void, Error, String>(
    (id) => axios.delete(`bills/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("bills");
      },
    }
  );

  return { query, mutation, deleteMutation };
}

export default BillsQueries;
