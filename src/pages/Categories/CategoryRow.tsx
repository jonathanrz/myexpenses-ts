import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Currency from "helpers/currency";
import { Category } from "models/Category";
import Form from "./Form";

interface CategoryRowProps {
  category: Category;
  deleteCategory: (id: string) => void;
}

function CategoryRow({ category, deleteCategory }: CategoryRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            category={category}
            onCategorySaved={() => setEdit(false)}
            onCancel={() => setEdit(false)}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {category.name}
      </TableCell>
      <TableCell component="th" scope="row">
        {Currency.format(category.forecast || 0)}
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        {category.display_in_month_expense ? "Yes" : "No"}
      </TableCell>
      <TableCell align="right">
        <IconButton component="button" onClick={() => setEdit(!edit)}>
          <EditIcon />
        </IconButton>
        <IconButton
          component="button"
          onClick={() => deleteCategory(category.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default CategoryRow;
