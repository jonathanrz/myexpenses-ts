import React, { useState } from "react";
import { AxiosInstance } from "axios";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Form from "./Form";
import { Category } from "./model";

interface CategoryRowProps {
  category: Category;
  axios: AxiosInstance;
  onCategorySaved: () => void;
  deleteCategory: (id: string) => void;
}

function CategoryRow({
  category,
  axios,
  onCategorySaved,
  deleteCategory,
}: CategoryRowProps) {
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <Form
            axios={axios}
            category={category}
            onCategorySaved={() => {
              setEdit(false);
              onCategorySaved();
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
        {category.name}
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
