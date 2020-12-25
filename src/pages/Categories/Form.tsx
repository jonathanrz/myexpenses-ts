import React from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikTextField from "../../components/formik/FormikTextField";
import { Category } from "../../models/Category";
import useCategoriesQuery from "../../queries/categories";

interface CategoryFormProps {
  category?: Category;
  onCategorySaved?: () => void;
  onCancel?: () => void;
}

const useStyles = makeStyles({
  form: {
    display: "grid",
    gridGap: "1rem",
    margin: "0 auto 1rem",
    maxWidth: "350px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
});

function CategoryForm({
  category = { id: "", name: "" },
  onCategorySaved,
  onCancel,
}: CategoryFormProps) {
  const classes = useStyles();
  const { mutation } = useCategoriesQuery();

  const formik = useFormik({
    initialValues: {
      name: category.name,
    },
    onSubmit: (values) =>
      mutation
        .mutateAsync({ ...values, id: category.id })
        .then(() => onCategorySaved && onCategorySaved()),
  });

  const submitButton = category.id ? "Save" : "Create";

  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <FormikTextField
        name="name"
        label="Name"
        formik={formik}
        autoFocus
        required
      />
      <div className={classes.buttonContainer}>
        {category.id ? (
          <Button variant="contained" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <div />
        )}
        <Button
          color="secondary"
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress /> : submitButton}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
