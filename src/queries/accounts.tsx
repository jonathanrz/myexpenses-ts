import useAxios from "../hooks/useAxios";
import sortBy from "lodash/sortBy";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Account } from "models/Account";
import { defaultQueryProps } from "./constants";

const MODEL_NAME = "account";
const PATH = "accounts";

function useAccountsQuery() {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Account>, Error>(
    PATH,
    () => axios.get(PATH).then(({ data }) => sortBy(data.data, "name")),
    defaultQueryProps
  );

  const mutation = useMutation<Account, Error, Account>(
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

export default useAccountsQuery;
