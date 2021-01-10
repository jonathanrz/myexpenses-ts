import React, { useMemo, useState } from "react";
import moment, { Moment } from "moment";
import sortBy from "lodash/sortBy";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Currency from "helpers/currency";
import { Account } from "models/Account";
import { Expense } from "models/Expense";
import { Receipt } from "models/Receipt";
import PrivatePage from "components/PrivatePage";
import ValueCell from "components/shared/ValueCell";
import useAccountsQuery from "queries/accounts";
import useExpensesQuery from "queries/expenses";
import useReceiptsQuery from "queries/receipts";

interface Transaction {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  date: Moment;
  value: number;
  receipt?: Receipt;
  expense?: Expense;
}

const useStyles = makeStyles({
  valueCell: {
    alignItems: "center",
    display: "flex",
  },
});

function Home() {
  const classes = useStyles();
  const [confirming, setConfirming] = useState(false);
  const month = moment();
  const { query: accountsQuery } = useAccountsQuery();
  const {
    query: receiptsQuery,
    confirmMutation: confirmReceipt,
  } = useReceiptsQuery(month);
  const {
    monthQuery: expensesQuery,
    confirmMutation: confirmExpense,
  } = useExpensesQuery(month);

  const transactions = useMemo(() => {
    const transactions: Transaction[] = [
      ...(receiptsQuery.data?.map((receipt) => ({
        id: `receipt_${receipt.id}`,
        name: receipt.name,
        confirmed: receipt.confirmed,
        account: receipt.account,
        date: receipt.date,
        value: receipt.value,
        receipt,
      })) || []),
      ...(expensesQuery.data?.map((expense) => ({
        id: `expense_${expense.id}`,
        name: expense.credit_card
          ? `${expense.name} - ${expense.credit_card?.name}`
          : expense.name,
        confirmed: expense.confirmed,
        account: expense.account || expense.credit_card?.account,
        date: expense.date,
        value: expense.value,
        expense,
      })) || []),
    ];

    return sortBy(transactions, "date");
  }, [receiptsQuery.data, expensesQuery.data]);

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

  function renderEmptyRow() {
    return (
      <TableRow>
        <TableCell colSpan={2 + (accountsQuery.data?.length || 0)} />
      </TableRow>
    );
  }

  function renderBalanceRow() {
    return (
      <TableRow>
        <TableCell>Balance</TableCell>
        <TableCell />
        {accountsQuery.data?.map((account) => (
          <TableCell key={account.id}>
            {Currency.format(account.balance)}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function renderContent() {
    if (accountsQuery.isLoading) return <CircularProgress />;
    if (accountsQuery.isError)
      return <Alert severity="error">{accountsQuery.error.message}</Alert>;

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              {accountsQuery.data?.map((account) => (
                <TableCell key={account.id}>{account.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderBalanceRow()}
            {renderEmptyRow()}
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
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return <PrivatePage title="Resume">{renderContent()}</PrivatePage>;
}

export default Home;
