import React from "react";
import { useFormik } from "formik";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikCurrencyField from "components/formik/FormikCurrencyField";
import FormikDateField from "components/formik/FormikDateField";
import FormikTextField from "components/formik/FormikTextField";
import FormikSelectField from "components/formik/FormikSelectField";
import { Account } from "models/Account";
import { Receipt } from "models/Receipt";
import useAccountsQuery from "queries/accounts";
import useReceiptsQuery from "queries/receipts";

const currentMonth = moment();

interface ReceiptFormProps {
  receipt?: Receipt;
  onReceiptSaved?: () => void;
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
  onReceiptSaved,
  onCancel,
}: ReceiptFormProps) {
  const classes = useStyles();
  const { query: accountsQuery } = useAccountsQuery();
  const { mutation } = useReceiptsQuery(currentMonth);

  const formik = useFormik({
    initialValues: {
      name: receipt.name,
      account_id: receipt.account ? receipt.account.id : "",
      confirmed: receipt.confirmed,
      value: receipt.value,
      date: receipt.date,
    },
    onSubmit: (values, { resetForm }) =>
      mutation.mutateAsync({ ...values, id: receipt.id }).then(() => {
        onReceiptSaved && onReceiptSaved();
        resetForm();
      }),
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
          accountsQuery.data
            ? accountsQuery.data.map((account: Account) => ({
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
