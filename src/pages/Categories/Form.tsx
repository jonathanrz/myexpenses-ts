import React from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikTextField from "components/formik/FormikTextField";
import FormikCurrencyField from "components/formik/FormikCurrencyField";
import { Category } from "models/Category";
import useCategoriesQuery from "queries/categories";

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
  category = { id: "", name: "", forecast: 0, display_in_month_expense: true },
  onCategorySaved,
  onCancel,
}: CategoryFormProps) {
  const classes = useStyles();
  const { mutation } = useCategoriesQuery();

  const formik = useFormik({
    initialValues: {
      name: category.name,
      forecast: category.forecast,
      display_in_month_expense: category.display_in_month_expense,
    },
    onSubmit: (values) =>
      mutation
        .mutateAsync({ ...values, id: category.id })
        .then(() => onCategorySaved && onCategorySaved()),
  });

  const submitButton = category.id ? "Save" : "Create";

  const { values, setFieldValue } = formik;

  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <FormikTextField
        name="name"
        label="Name"
        formik={formik}
        autoFocus
        required
      />
      <FormikCurrencyField
        name="forecast"
        label="Forecast"
        formik={formik}
        required
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={values.display_in_month_expense}
            onChange={(event) =>
              setFieldValue("display_in_month_expense", event.target.checked)
            }
            color="secondary"
          />
        }
        label="Display In Month Expenses"
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
