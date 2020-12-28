import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "hooks/useAxios";
import { Place } from "models/Place";

const MODEL_NAME = "place";
const PATH = "places";

function usePlacesQuery() {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const query = useQuery<Array<Place>, Error>(PATH, () =>
    axios.get(PATH).then(({ data }) => data.data)
  );

  const mutation = useMutation<Place, Error, Place>(
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

export default usePlacesQuery;
