import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import Cookie from "js-cookie";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikTextField from "components/formik/FormikTextField";

const instance = axios.create({
  baseURL: process.env.REACT_APP_MYEXPENSES_TS_API,
});

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login() {
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: (values) => {
      setError(undefined);

      return instance
        .post("users/signin", values)
        .then(({ data }) => {
          Cookie.set("user", JSON.stringify(data));
          setSigned(true);
        })
        .catch((e) => setError(e.message));
    },
  });

  if (signed) {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { from: "/login" },
        }}
      />
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.container}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="email"
            label="Email"
            formik={formik}
            autoComplete="email"
            autoFocus
            required
          />
          <FormikTextField
            name="password"
            label="Password"
            type="password"
            formik={formik}
            autoComplete="current-password"
            required
          />
          <Button
            color="secondary"
            className={classes.submit}
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
            fullWidth
          >
            {formik.isSubmitting ? <CircularProgress size={20} /> : "Sign in"}
          </Button>
        </form>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
}

export default Login;
