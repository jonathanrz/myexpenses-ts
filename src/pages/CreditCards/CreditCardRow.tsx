import React, { useState } from "react";
import { AxiosInstance } from "axios";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Form from "./Form";
import { CreditCard } from "./model";

interface CreditCardRowProps {
  creditCard: CreditCard;
  axios: AxiosInstance;
  onCreditCardSaved: () => void;
  deleteCreditCard: (id: string) => void;
}

function CreditCardRow({
  creditCard,
  axios,
  onCreditCardSaved,
  deleteCreditCard,
}: CreditCardRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={2}>
          <Form
            axios={axios}
            creditCard={creditCard}
            onCreditCardSaved={() => {
              setEdit(false);
              onCreditCardSaved();
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
        {creditCard.name}
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton
          component="button"
          onClick={() => deleteCreditCard(creditCard.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default CreditCardRow;
