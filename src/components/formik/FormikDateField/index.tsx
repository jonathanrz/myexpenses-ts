import React from "react";
import Alert from "@material-ui/lab/Alert";
import { DatePicker } from "@material-ui/pickers";

interface Formik {
  touched: any;
  errors: any;
  values: any;
  setFieldValue: (name: string, date: any /*MaterialUiPickersDate*/) => void;
}

interface FormikDateFieldProps {
  name: string;
  label: string;
  formik: Formik;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
}

function FormikDateField({
  name,
  label,
  formik,
  ...props
}: FormikDateFieldProps) {
  const hasError = Boolean(formik.touched[name] && formik.errors[name]);
  return (
    <div>
      <DatePicker
        id={name}
        label={label}
        fullWidth
        format="DD/MM/yyyy"
        onChange={(date) => formik.setFieldValue(name, date)}
        value={formik.values[name]}
        error={hasError}
        {...props}
      />
      {hasError ? <Alert severity="error">{formik.errors[name]}</Alert> : null}
    </div>
  );
}

export default React.memo(FormikDateField);
