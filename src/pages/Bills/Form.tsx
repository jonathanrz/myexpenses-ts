import React from "react";
import { useFormik } from "formik";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormikCurrencyField from "components/formik/FormikCurrencyField";
import FormikDateField from "components/formik/FormikDateField";
import FormikTextField from "components/formik/FormikTextField";
import FormikSelectField from "components/formik/FormikSelectField";
import { Account } from "models/Account";
import { Bill } from "models/Bill";
import { Category } from "models/Category";
import useAccountsQuery from "queries/accounts";
import useBillsQuery from "queries/bills";
import useCategoriesQuery from "queries/categories";

interface BillFormProps {
  bill?: Bill;
  onBillSaved?: () => void;
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

function BillForm({
  bill = {
    id: 0,
    name: "",
    due_day: 0,
    init_date: moment(),
    end_date: moment(),
    value: 0,
  },
  onBillSaved,
  onCancel,
}: BillFormProps) {
  const classes = useStyles();
  const { query: accountsQuery } = useAccountsQuery();
  const { query: categoriesQuery } = useCategoriesQuery();
  const { mutation } = useBillsQuery();

  const formik = useFormik({
    initialValues: {
      name: bill.name,
      account_id: bill.account?.id || "",
      category_id: bill.category?.id || "",
      due_day: bill.due_day,
      init_date: bill.init_date,
      end_date: bill.end_date,
      value: bill.value,
    },
    onSubmit: (values, { resetForm }) =>
      mutation
        .mutateAsync({
          ...values,
          id: bill.id,
        })
        .then(() => {
          onBillSaved && onBillSaved();
          resetForm();
        }),
  });

  const submitButton = bill.id ? "Save" : "Create";

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
          accountsQuery.data?.map((account: Account) => ({
            label: account.name,
            value: account.id,
          })) || []
        }
        formik={formik}
        fullWidth
        required
      />
      <FormikSelectField
        name="category_id"
        label="Category"
        options={
          categoriesQuery.data?.map((category: Category) => ({
            label: category.name,
            value: category.id,
          })) || []
        }
        formik={formik}
        fullWidth
        required
      />
      <FormikTextField
        name="due_day"
        label="Due Day"
        formik={formik}
        type="number"
        required
      />
      <FormikDateField
        name="init_date"
        label="Init Date"
        formik={formik}
        required
      />
      <FormikDateField
        name="end_date"
        label="End Date"
        formik={formik}
        required
      />
      <FormikCurrencyField
        name="value"
        label="Value"
        formik={formik}
        required
      />
      <div className={classes.buttonContainer}>
        {bill.id ? (
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

export default BillForm;
