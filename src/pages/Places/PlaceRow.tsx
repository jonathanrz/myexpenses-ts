import React, { useState } from "react";
import { AxiosInstance } from "axios";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Form from "./Form";
import { Place } from "./model";

interface PlaceRowProps {
  place: Place;
  axios: AxiosInstance;
  onPlaceSaved: () => void;
  deletePlace: (id: string) => void;
}

function PlaceRow({ place, axios, onPlaceSaved, deletePlace }: PlaceRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            axios={axios}
            place={place}
            onPlaceSaved={() => {
              setEdit(false);
              onPlaceSaved();
            }}
            onCancel={() => setEdit(false)}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {place.name}
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton component="button" onClick={() => deletePlace(place.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default PlaceRow;
