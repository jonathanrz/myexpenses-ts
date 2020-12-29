import useAxios from "../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Account } from "models/Account";

const MODEL_NAME = "account";
const PATH = "accounts";

function useAccountsQuery() {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Account>, Error>(PATH, () =>
    axios.get(PATH).then(({ data }) => data.data)
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

  function renderAccountName(account?: Account) {
    if (!account) return "No account";
    if (query.isLoading) return "Loading...";
    if (query.isError) return query.error.message;

    const accountData = query.data?.find((a) => a.id === account.id);
    if (!accountData) return "Account not found";

    return accountData.name;
  }

  return { query, mutation, deleteMutation, renderAccountName };
}

export default useAccountsQuery;
