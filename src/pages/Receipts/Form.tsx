import React from "react";
import { AxiosInstance } from "axios";
import { useFormik } from "formik";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikCurrencyField from "../../components/formik/FormikCurrencyField";
import FormikDateField from "../../components/formik/FormikDateField";
import FormikTextField from "../../components/formik/FormikTextField";
import FormikSelectField from "../../components/formik/FormikSelectField";
import { State } from "../../hooks/model";
import { Account } from "../../models/Account";
import { Receipt } from "./model";

interface ReceiptFormProps {
  axios: AxiosInstance;
  receipt?: Receipt;
  accountsAsync: State<Array<Account>>;
  onReceiptSaved: () => void;
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
    marginTop: "1rem",
  },
});

function ReceiptForm({
  receipt = { id: "", name: "", confirmed: false, value: 0, date: moment() },
  axios,
  accountsAsync,
  onReceiptSaved,
  onCancel,
}: ReceiptFormProps) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      name: receipt.name,
      account_id: receipt.account ? receipt.account.id : "",
      confirmed: receipt.confirmed,
      value: receipt.value,
      date: receipt.date,
    },
    onSubmit: (values) => {
      if (receipt.id) {
        return axios
          .patch(`/receipts/${receipt.id}`, { receipt: values })
          .then(() => onReceiptSaved());
      }
      return axios
        .post("/receipts", { receipt: values })
        .then(() => onReceiptSaved());
    },
  });

  const submitButton = receipt.id ? "Save" : "Create";

  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <FormikTextField
        name="name"
        label="Name"
        formik={formik}
        autoFocus
        required
      />
      <FormikSelectField
        name="account_id"
        label="Account"
        options={
          accountsAsync.result
            ? accountsAsync.result.map((account: Account) => ({
                label: account.name,
                value: account.id,
              }))
            : []
        }
        formik={formik}
        fullWidth
        required
      />
      <FormikDateField name="date" label="Date" formik={formik} required />
      <FormikCurrencyField
        name="value"
        label="Value"
        formik={formik}
        required
      />
      <div className={classes.buttonContainer}>
        {receipt.id ? (
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

export default ReceiptForm;
