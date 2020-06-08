import React from "react";
import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import FormikTextField from "../../components/formik/FormikTextField";

function Login() {
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: console.log,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormikTextField name="name" label="Name" formik={formik} />
      <FormikTextField
        name="password"
        label="Password"
        type="password"
        formik={formik}
      />
      <Button color="secondary" type="submit" variant="contained">
        Login
      </Button>
    </form>
  );
}

export default Login;
