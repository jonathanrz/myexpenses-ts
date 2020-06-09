import React from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import FormikTextField from "../../components/formik/FormikTextField";

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
  const classes = useStyles();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: console.log,
  });

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
            name="name"
            label="Name"
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
            fullWidth
          >
            Sign in
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
