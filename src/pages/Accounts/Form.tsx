import React from "react";
import { AxiosInstance } from "axios";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormikTextField from "../../components/formik/FormikTextField";

interface AccountFormProps {
  axios: AxiosInstance;
}

const useStyles = makeStyles({
  form: {
    display: "grid",
    gridGap: "1rem",
    maxWidth: "350px",
  },
});

function AccountForm({ axios }: AccountFormProps) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      name: "",
      balance: 0,
    },
    onSubmit: (values) => {
      axios.post("/accounts", { account: values }).then(console.log);
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
      <Button color="secondary" type="submit" variant="contained">
        Create
      </Button>
    </form>
  );
}

export default AccountForm;
