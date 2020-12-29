import React from "react";
import { Place } from "models/Place";
import usePlacesQuery from "queries/places";

interface PlaceCellProps {
  place?: Place;
}

function PlaceCell({ place }: PlaceCellProps) {
  const { query } = usePlacesQuery();
  if (!place) return <div>No place</div>;
  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  const data = query.data?.find((a) => a.id === place.id);
  if (!data) return <div>Place not found</div>;
  return <div>{data.name}</div>;
}

export default PlaceCell;
