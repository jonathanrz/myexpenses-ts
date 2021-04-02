import { useQuery, useMutation, useQueryClient } from "react-query";
import { Account } from "models/Account";

const PATH = "accounts";

interface AccountsQueryProps {
  accounts: Array<Account>;
}

function useAccountsQuery({ accounts }: AccountsQueryProps) {
  const queryClient = useQueryClient();

  const query = useQuery<Array<Account>, Error>(PATH, () =>
    Promise.resolve(accounts)
  );

  const mutation = useMutation<Account, Error, Account>(
    (values) => Promise.resolve(values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PATH);
      },
    }
  );

  const deleteMutation = useMutation<void, Error, String>(
    (id) => Promise.resolve(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PATH);
      },
    }
  );

  return { query, mutation, deleteMutation };
}

export default useAccountsQuery;
