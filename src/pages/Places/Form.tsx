import React from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikTextField from "../../components/formik/FormikTextField";
import { Place } from "../../models/Place";
import usePlacesQuery from "../../queries/places";

interface PlaceFormProps {
  place?: Place;
  onPlaceSaved?: () => void;
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

function PlaceForm({
  place = { id: "", name: "" },
  onPlaceSaved,
  onCancel,
}: PlaceFormProps) {
  const classes = useStyles();
  const { mutation } = usePlacesQuery();

  const formik = useFormik({
    initialValues: {
      name: place.name,
    },
    onSubmit: (values) =>
      mutation
        .mutateAsync({ ...values, id: place.id })
        .then(() => onPlaceSaved && onPlaceSaved()),
  });

  const submitButton = place.id ? "Save" : "Create";

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
        {place.id ? (
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

export default PlaceForm;
