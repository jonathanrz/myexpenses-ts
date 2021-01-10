import React, { useState } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Transaction } from "models/Transaction";
import ValueCell from "components/shared/ValueCell";
import useAccountsQuery from "queries/accounts";
import useExpensesQuery from "queries/expenses";
import useReceiptsQuery from "queries/receipts";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const useStyles = makeStyles({
  valueCell: {
    alignItems: "center",
    display: "flex",
  },
});

function TransactionsTable({ transactions }: TransactionsTableProps) {
  const classes = useStyles();
  const [confirming, setConfirming] = useState(false);
  const month = moment();
  const { query: accountsQuery } = useAccountsQuery();
  const { confirmMutation: confirmReceipt } = useReceiptsQuery(month);
  const { confirmMutation: confirmExpense } = useExpensesQuery(month);

  function confirm(transaction: Transaction) {
    setConfirming(true);

    let mutation;

    if (transaction.receipt) {
      mutation = confirmReceipt.mutateAsync(transaction.receipt);
    } else if (transaction.expense) {
      mutation = confirmExpense.mutateAsync(transaction.expense);
    }

    mutation?.finally(() => setConfirming(false));
  }

  function renderConfirmButton(transaction: Transaction) {
    if (confirming) return <CircularProgress size={26} />;
    if (transaction.expense?.credit_card) return null;

    return (
      <IconButton
        color="default"
        size="small"
        onClick={() => confirm(transaction)}
      >
        {transaction.confirmed ? (
          <ClearIcon fontSize="small" />
        ) : (
          <DoneIcon fontSize="small" />
        )}
      </IconButton>
    );
  }

  return (
    <React.Fragment>
      {transactions.map((transaction) => (
        <TableRow key={transaction.id}>
          <TableCell>{transaction.name}</TableCell>
          <TableCell>{transaction.date.format("DD")}</TableCell>
          {accountsQuery.data?.map((account) => (
            <TableCell key={account.id}>
              {account.id === transaction.account?.id ? (
                <div className={classes.valueCell}>
                  <ValueCell
                    value={transaction.value}
                    confirmed={transaction.confirmed}
                    receipt={Boolean(transaction.receipt)}
                    expense={Boolean(transaction.expense)}
                  />
                  {renderConfirmButton(transaction)}
                </div>
              ) : (
                ""
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </React.Fragment>
  );
}

export default TransactionsTable;
