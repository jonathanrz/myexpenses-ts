import React from "react";
import Alert from "@material-ui/lab/Alert";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

interface Formik {
  touched: any;
  errors: any;
  values: any;
  handleChange: (
    eventOrPath: string | React.ChangeEvent<any>
  ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
}

interface FormikSelectFieldOption {
  label: string;
  value: number | string;
}

interface FormikSelectFieldProps {
  name: string;
  label: string;
  formik: Formik;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  options: Array<FormikSelectFieldOption>;
  handleChange?: (selectedFieldId: number) => void;
}

function FormikSelectField({
  name,
  label,
  formik,
  options,
  handleChange,
  ...props
}: FormikSelectFieldProps) {
  const hasError = Boolean(formik.touched[name] && formik.errors[name]);
  return (
    <div>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        id={name}
        onChange={(e) => {
          e.target.name = name;
          formik.handleChange(e);
          handleChange && handleChange(e.target.value as number);
        }}
        value={formik.values[name]}
        error={hasError}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {hasError ? <Alert severity="error">{formik.errors[name]}</Alert> : null}
    </div>
  );
}

export default React.memo(FormikSelectField);
