import useAxios from "../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Account } from "../models/Account";

function AccountsQueries() {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Account>, Error>("accounts", () =>
    axios.get("accounts").then(({ data }) => data.data)
  );

  const mutation = useMutation<Account, Error, Account>(
    (values) => {
      if (values.id) {
        return axios
          .patch(`/accounts/${values.id}`, { account: values })
          .then(({ data }) => data.data);
      }
      return axios
        .post("/accounts", { account: values })
        .then(({ data }) => data.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("accounts");
      },
    }
  );

  const deleteMutation = useMutation<void, Error, String>(
    (id) => axios.delete(`accounts/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("accounts");
      },
    }
  );

  return { query, mutation, deleteMutation };
}

export default AccountsQueries;
