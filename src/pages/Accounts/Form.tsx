import React from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikCurrencyField from "components/formik/FormikCurrencyField";
import FormikTextField from "components/formik/FormikTextField";
import { Account } from "models/Account";
import useAccountsQuery from "queries/accounts";

interface AccountFormProps {
  account?: Account;
  onAccountSaved?: () => void;
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

function AccountForm({
  account = { id: "", name: "", balance: 0 },
  onAccountSaved,
  onCancel,
}: AccountFormProps) {
  const classes = useStyles();
  const { mutation } = useAccountsQuery();

  const formik = useFormik({
    initialValues: {
      name: account.name,
      balance: account.balance,
    },
    onSubmit: (values) =>
      mutation
        .mutateAsync({ ...values, id: account.id })
        .then(() => onAccountSaved && onAccountSaved()),
  });

  const submitButton = account.id ? "Save" : "Create";

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
        name="balance"
        label="Balance"
        formik={formik}
        required
      />
      <div className={classes.buttonContainer}>
        {account.id ? (
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
          {formik.isSubmitting ? <CircularProgress size={20} /> : submitButton}
        </Button>
      </div>
    </form>
  );
}

export default AccountForm;
