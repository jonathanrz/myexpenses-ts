import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Form from "./Form";
import { Place } from "../../models/Place";

interface PlaceRowProps {
  place: Place;
  deletePlace: (id: string) => void;
}

function PlaceRow({ place, deletePlace }: PlaceRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            place={place}
            onPlaceSaved={() => setEdit(false)}
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
