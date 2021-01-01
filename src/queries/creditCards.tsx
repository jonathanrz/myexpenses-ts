import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import { CreditCard } from "models/CreditCard";
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

  return { query, mutation, deleteMutation };
}

export default useCreditCardsQuery;
