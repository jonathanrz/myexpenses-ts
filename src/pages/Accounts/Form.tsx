import React from "react";
import { AxiosInstance } from "axios";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormikTextField from "../../components/formik/FormikTextField";
import { Account } from "./model";

interface AccountFormProps {
  axios: AxiosInstance;
  account?: Account;
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
  axios,
}: AccountFormProps) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      name: account.name,
      balance: account.balance,
    },
    onSubmit: (values) => {
      if (account.id) {
        return axios
          .patch(`/accounts/${account.id}`, { account: values })
          .then(console.log);
      }
      return axios.post("/accounts", { account: values }).then(console.log);
    },
  });

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
        name="balance"
        label="Balance"
        formik={formik}
        required
      />
      <div className={classes.buttonContainer}>
        {account.id ? <Button variant="contained">Cancel</Button> : <div />}
        <Button color="secondary" type="submit" variant="contained">
          Create
        </Button>
      </div>
    </form>
  );
}

export default AccountForm;
