import React from "react";
import { AxiosInstance } from "axios";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikCurrencyField from "../../components/formik/FormikCurrencyField";
import FormikDateField from "../../components/formik/FormikDateField";
import FormikTextField from "../../components/formik/FormikTextField";
import { Bill } from "./model";

interface BillFormProps {
  axios: AxiosInstance;
  bill?: Bill;
  onBillSaved: () => void;
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

function BillForm({
  bill = {
    id: "",
    name: "",
    due_day: 0,
    init_date: moment(),
    end_date: moment(),
    value: 0,
  },
  axios,
  onBillSaved,
  onCancel,
}: BillFormProps) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      name: bill.name,
      due_day: bill.due_day,
      init_date: bill.init_date,
      end_date: bill.end_date,
      value: bill.value,
    },
    onSubmit: (values) => {
      if (bill.id) {
        return axios
          .patch(`/bills/${bill.id}`, {
            bill: {
              ...values,
              init_date: values.init_date.toISOString(),
              end_date: values.end_date.toISOString(),
            },
          })
          .then(() => onBillSaved());
      }
      return axios.post("/bills", { bill: values }).then(() => onBillSaved());
    },
  });

  const submitButton = bill.id ? "Save" : "Create";

  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <FormikTextField
        name="name"
        label="Name"
        formik={formik}
        autoFocus
        required
      />
      <FormikTextField
        name="due_day"
        label="Due Day"
        formik={formik}
        type="number"
        required
      />
      <FormikDateField
        name="init_date"
        label="Init Date"
        formik={formik}
        required
      />
      <FormikDateField
        name="end_date"
        label="End Date"
        formik={formik}
        required
      />
      <FormikCurrencyField
        name="value"
        label="Value"
        formik={formik}
        required
      />
      <div className={classes.buttonContainer}>
        {bill.id ? (
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

export default BillForm;