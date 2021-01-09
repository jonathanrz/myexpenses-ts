import useAxios from "../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Category } from "models/Category";
import { defaultQueryProps } from "./constants";

const MODEL_NAME = "category";
const PATH = "categories";

function useCategoriesQuery() {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Category>, Error>(
    PATH,
    () => axios.get(PATH).then(({ data }) => data.data),
    defaultQueryProps
  );

  const mutation = useMutation<Category, Error, Category>(
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

export default useCategoriesQuery;
