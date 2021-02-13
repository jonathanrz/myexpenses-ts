import React, { useMemo, useState } from "react";
import moment from "moment";
import keyBy from "lodash/keyBy";
import { useFormik } from "formik";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormikCurrencyField from "components/formik/FormikCurrencyField";
import AccountSelect from "components/shared/AccountSelect";
import useAccountsQuery from "queries/accounts";
import useCategoriesQuery from "queries/categories";
import useExpensesQuery from "queries/expenses";
import useReceiptsQuery from "queries/receipts";

const today = moment();

function TransferButton() {
  const [open, setOpen] = useState(false);

  const { query: accountsQuery } = useAccountsQuery();
  const { query: categoriesQuery } = useCategoriesQuery();
  const { mutation: createExpense } = useExpensesQuery(today.clone());
  const { mutation: createReceipt } = useReceiptsQuery(today.clone());

  const accountsKeyed = useMemo(() => keyBy(accountsQuery.data || [], "id"), [
    accountsQuery.data,
  ]);

  const transferCategory = useMemo(
    () => categoriesQuery.data?.find((c) => c.name === "Transferências"),
    [categoriesQuery.data]
  );

  const formik = useFormik({
    initialValues: {
      from: "",
      to: "",
      value: "",
    },
    onSubmit: (values, { resetForm }) => {
      console.log({ values });
      return createExpense
        .mutateAsync({
          name: `Transfer to ${accountsKeyed[values.to].name}`,
          confirmed: false,
          account_id: accountsKeyed[values.from].id,
          category_id: transferCategory?.id,
          date: today,
          value: Number.parseInt(values.value.toString()),
        })
        .then(() =>
          createReceipt
            .mutateAsync({
              name: `Transfer from ${accountsKeyed[values.from].name}`,
              confirmed: false,
              account_id: accountsKeyed[values.to].id,
              date: today,
              value: Number.parseInt(values.value.toString()),
            })
            .then(() => {
              resetForm();
              setOpen(false);
            })
        );
    },
  });

  return (
    <React.Fragment>
      <Button color="inherit" onClick={() => setOpen(true)}>
        Transfer
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Transfer</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <AccountSelect
              name="from"
              label="From"
              value={formik.values.from}
              handleChange={formik.handleChange}
            />
            <AccountSelect
              name="to"
              label="To"
              value={formik.values.to}
              handleChange={formik.handleChange}
            />
            <FormikCurrencyField
              name="value"
              label="Value"
              formik={formik}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              color="secondary"
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <CircularProgress /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default TransferButton;
