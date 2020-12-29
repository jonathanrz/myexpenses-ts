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

  function renderPlaceName(place?: Place) {
    if (!place) return "No place";
    if (query.isLoading) return "Loading...";
    if (query.isError) return query.error.message;

    const data = query.data?.find((a) => a.id === place.id);
    if (!data) return "Place not found";

    return data.name;
  }

  return { query, mutation, deleteMutation, renderPlaceName };
}

export default usePlacesQuery;
