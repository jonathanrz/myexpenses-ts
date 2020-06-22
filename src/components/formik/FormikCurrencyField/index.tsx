import React from "react";
import Alert from "@material-ui/lab/Alert";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Currency from "../../../helpers/currency";

interface Formik {
  touched: any;
  errors: any;
  values: any;
  handleChange: (
    eventOrPath: string | React.ChangeEvent<any>
  ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
}

interface FormikCurrencyFieldProps {
  name: string;
  label: string;
  formik: Formik;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
}

function FormikCurrencyField({
  name,
  label,
  formik,
  ...props
}: FormikCurrencyFieldProps) {
  const hasError = Boolean(formik.touched[name] && formik.errors[name]);
  return (
    <FormControl error={hasError}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input
        id={name}
        value={Currency.format(formik.values[name])}
        onChange={(e) => {
          e.target.value = Currency.parse(e.target.value);
          formik.handleChange(e);
        }}
        {...props}
      />
      {hasError ? <Alert severity="error">{formik.errors[name]}</Alert> : null}
    </FormControl>
  );
}

export default React.memo(FormikCurrencyField);
