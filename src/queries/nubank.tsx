import moment from "moment";
import useAxios from "hooks/useAxios";
import { useQuery } from "react-query";
import { Expense } from "models/Expense";
import { defaultQueryProps } from "./constants";

const PATH = "expenses/nubank";

function useNubankQuery() {
  const axios = useAxios();

  const query = useQuery<Array<Expense>, Error>(
    PATH,
    () =>
      axios.get(PATH).then(({ data }) =>
        data.data.map((expense: Expense) => ({
          ...expense,
          date: moment(expense.date),
        }))
      ),
    defaultQueryProps
  );

  return { query };
}

export default useNubankQuery;
