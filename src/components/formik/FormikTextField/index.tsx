import React from "react";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";

interface Formik {
  touched: any;
  errors: any;
  values: any;
  handleChange: (
    eventOrPath: string | React.ChangeEvent<any>
  ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
}

interface FormikTextFieldProps {
  name: string;
  label: string;
  formik: Formik;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
}

function FormikTextField({
  name,
  label,
  formik,
  ...props
}: FormikTextFieldProps) {
  const hasError = Boolean(formik.touched[name] && formik.errors[name]);
  return (
    <div>
      <TextField
        id={name}
        label={label}
        margin="normal"
        fullWidth
        onChange={formik.handleChange}
        value={formik.values[name]}
        error={hasError}
        {...props}
      />
      {hasError ? <Alert severity="error">{formik.errors[name]}</Alert> : null}
    </div>
  );
}

export default React.memo(FormikTextField);
