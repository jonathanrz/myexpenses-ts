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
import { CreditCard } from "models/CreditCard";
import { Expense } from "models/Expense";
import { NubankEvent } from "models/NubankEvent";
import { Place } from "models/Place";
import useAccountsQuery from "queries/accounts";
import useBillsQuery from "queries/bills";
import useCategoriesQuery from "queries/categories";
import useCreditCardsQuery from "queries/creditCards";
import usePlacesQuery from "queries/places";
import useExpensesQuery from "queries/expenses";

const currentMonth = moment();

interface ExpenseFormProps {
  bill?: Bill;
  expense?: Expense;
  nubankEvent?: NubankEvent;
  onExpenseSaved?: () => void;
  onCancel?: () => void;
}

const useStyles = makeStyles({
  form: {
    display: "grid",
    gridGap: "1rem",
    margin: "0 auto 1rem",
    maxWidth: "450px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
});

function ExpenseForm({
  expense = {
    id: "",
    name: "",
    confirmed: false,
    value: 0,
    date: moment(),
    installmentNumber: "",
    installmentCount: 0,
    nubank_id: "",
  },
  bill,
  nubankEvent,
  onExpenseSaved,
  onCancel,
}: ExpenseFormProps) {
  const classes = useStyles();
  const { query: accountsQuery } = useAccountsQuery();
  const { query: billsQuery } = useBillsQuery();
  const { query: categoriesQuery } = useCategoriesQuery();
  const { query: creditCardsQuery } = useCreditCardsQuery();
  const { query: placesQuery } = usePlacesQuery();
  const { mutation } = useExpensesQuery(currentMonth);

  const formik = useFormik({
    initialValues: {
      name: bill?.name || nubankEvent?.description || expense.name,
      account_id: expense.account?.id || bill?.account?.id || "",
      bill_id: expense.bill?.id || bill?.id || "",
      category_id: expense.category?.id || bill?.category?.id || "",
      credit_card_id: expense.credit_card?.id || (nubankEvent && 1) || "",
      place_id: expense.place?.id || "",
      confirmed: expense.confirmed,
      value: bill?.value || nubankEvent?.amount || expense.value,
      date: nubankEvent?.time || expense.date,
      installmentNumber:
        nubankEvent?.details?.charges?.count?.toString() ||
        expense.installmentNumber,
      installmentCount: expense.installmentCount,
      nubank_id: nubankEvent?.id || expense.nubank_id,
    },
    onSubmit: (values, { resetForm }) =>
      mutation
        .mutateAsync({
          ...values,
          value: Number.parseInt(values.value.toString()),
          id: expense.id,
        })
        .then(() => {
          onExpenseSaved && onExpenseSaved();
          resetForm();
        }),
  });

  function handleBillSelected(selectedFieldId?: number) {
    const bill = billsQuery.data?.find((bill) => bill.id === selectedFieldId);

    if (bill != null) {
      formik.setFieldValue("name", bill.name);
      formik.setFieldValue("value", bill.value);
    }
  }

  const submitButton = expense.id ? "Save" : "Create";

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
        disabled={Boolean(formik.values.credit_card_id)}
        fullWidth
        required
      />
      <FormikSelectField
        name="credit_card_id"
        label="Credit Card"
        options={
          creditCardsQuery.data?.map((creditCard: CreditCard) => ({
            label: creditCard.name,
            value: creditCard.id,
          })) || []
        }
        formik={formik}
        disabled={Boolean(formik.values.account_id)}
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
      <FormikSelectField
        name="place_id"
        label="Place"
        options={
          placesQuery.data?.map((place: Place) => ({
            label: place.name,
            value: place.id,
          })) || []
        }
        formik={formik}
        fullWidth
        required
      />
      <FormikDateField name="date" label="Date" formik={formik} required />
      <FormikCurrencyField
        name="value"
        label="Value"
        formik={formik}
        required
      />
      <FormikTextField
        name="installmentNumber"
        label="Installments"
        formik={formik}
      />
      <FormikSelectField
        name="bill_id"
        label="Bill"
        options={
          billsQuery.data?.map((bill: Bill) => ({
            label: bill.name,
            value: bill.id,
          })) || []
        }
        formik={formik}
        fullWidth
        required
        handleChange={handleBillSelected}
      />
      <div className={classes.buttonContainer}>
        {expense.id ? (
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

export default ExpenseForm;
