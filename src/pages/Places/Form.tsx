import React from "react";
import { AxiosInstance } from "axios";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikTextField from "../../components/formik/FormikTextField";
import { Place } from "./model";

interface PlaceFormProps {
  axios: AxiosInstance;
  place?: Place;
  onPlaceSaved: () => void;
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
  axios,
  onPlaceSaved,
  onCancel,
}: PlaceFormProps) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      name: place.name,
    },
    onSubmit: (values) => {
      if (place.id) {
        return axios
          .patch(`/places/${place.id}`, { place: values })
          .then(() => onPlaceSaved());
      }
      return axios
        .post("/places", { place: values })
        .then(() => onPlaceSaved());
    },
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
