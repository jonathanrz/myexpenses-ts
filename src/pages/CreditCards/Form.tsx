import React from "react";
import { AxiosInstance } from "axios";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikTextField from "../../components/formik/FormikTextField";
import FormikSelectField from "../../components/formik/FormikSelectField";
import { State } from "../../hooks/model";
import { Account } from "../Accounts/model";
import { CreditCard } from "./model";

interface CreditCardFormProps {
  axios: AxiosInstance;
  creditCard?: CreditCard;
  accountsAsync: State<Array<Account>>;
  onCreditCardSaved: () => void;
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

function CreditCardForm({
  creditCard = { id: "", name: "" },
  axios,
  accountsAsync,
  onCreditCardSaved,
  onCancel,
}: CreditCardFormProps) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      name: creditCard.name,
      account_id: creditCard.account ? creditCard.account.id : "",
    },
    onSubmit: (values) => {
      if (creditCard.id) {
        return axios
          .patch(`/credit_cards/${creditCard.id}`, { credit_card: values })
          .then(() => onCreditCardSaved());
      }
      return axios
        .post("/credit_cards", { credit_card: values })
        .then(() => onCreditCardSaved());
    },
  });

  const submitButton = creditCard.id ? "Save" : "Create";

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
      <div className={classes.buttonContainer}>
        {creditCard.id ? (
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

export default CreditCardForm;
