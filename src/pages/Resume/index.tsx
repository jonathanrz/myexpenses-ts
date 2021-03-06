import React, { useMemo, useState } from "react";
import moment from "moment";
import sortBy from "lodash/sortBy";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Currency from "helpers/currency";
import { Account } from "models/Account";
import { Bill } from "models/Bill";
import { Receipt } from "models/Receipt";
import { Expense } from "models/Expense";
import { Transaction } from "models/Transaction";
import PrivatePage from "components/PrivatePage";
import useAccountsQuery from "queries/accounts";
import TransactionsTable from "./TransactionsTable";
import useMonthTransactionsQuery from "./useMonthTransactionsQuery";

const useStyles = makeStyles({
  balance: {
    fontWeight: "bold",
  },
  balanceRow: {
    "&:nth-of-type(even)": {
      backgroundColor: "#EEEEEE",
    },
  },
  filter: {
    display: "flex",
    justifyContent: "flex-end",
  },
  fullRow: {
    textAlign: "center",
    backgroundColor: "#DDDDDD",
    fontWeight: "bold",
    padding: "0.5rem",
  },
});

const month = moment();
const nextMonth = moment().add(1, "month");

interface GenerateTransactionsProps {
  receipts?: Receipt[];
  expenses?: Expense[];
  bills?: Bill[];
  displayConfirmed: boolean;
}

function generateTransactions({
  receipts,
  expenses,
  bills,
  displayConfirmed,
}: GenerateTransactionsProps): Transaction[] {
  let transactions = [
    ...(receipts?.map((receipt) => ({
      id: `receipt_${receipt.id}`,
      name: receipt.name,
      confirmed: receipt.confirmed,
      account: receipt.account,
      day: receipt.date.date(),
      value: receipt.value,
      receipt,
    })) || []),
    ...(expenses?.map((expense) => ({
      id: `expense_${expense.id}`,
      name: expense.credit_card
        ? `${expense.name} - ${expense.credit_card?.name}`
        : expense.name,
      confirmed: expense.confirmed,
      account: expense.account || expense.credit_card?.account,
      day: expense.date.date(),
      value: expense.value,
      expense,
    })) || []),
    ...(bills?.map((bill) => ({
      id: `bill_${bill.id}`,
      name: bill.name,
      confirmed: false,
      account: bill.account,
      day: bill.due_day,
      value: bill.value,
      bill,
    })) || []),
  ];

  if (!displayConfirmed)
    transactions = transactions.filter((t) => !t.confirmed);

  return sortBy(transactions, "day");
}

function updateAccountBalances(
  transactions: Transaction[],
  accounts?: Account[]
) {
  return accounts?.map((account) => ({
    ...account,
    balance:
      account.balance +
      transactions.reduce((accum: number, transaction: Transaction) => {
        if (transaction.confirmed || transaction.account?.id !== account.id)
          return accum;

        if (transaction.receipt) return accum + transaction.value;

        return accum - transaction.value;
      }, 0),
  }));
}

function Home() {
  const classes = useStyles();
  const [displayConfirmed, setDisplayConfirmed] = useState(false);
  const { query: accountsQuery } = useAccountsQuery();
  const currentMonthTransactionsQuery = useMonthTransactionsQuery(month);
  const nextMonthTransactionsQuery = useMonthTransactionsQuery(nextMonth);

  const transactions = useMemo(
    () =>
      generateTransactions({
        ...currentMonthTransactionsQuery,
        displayConfirmed,
      }),
    [currentMonthTransactionsQuery, displayConfirmed]
  );

  const nextMonthTransactions = useMemo(
    () =>
      generateTransactions({ ...nextMonthTransactionsQuery, displayConfirmed }),
    [nextMonthTransactionsQuery, displayConfirmed]
  );

  const accountsBalanceAtEndOfMonth = useMemo(
    () => updateAccountBalances(transactions, accountsQuery.data),
    [accountsQuery.data, transactions]
  );

  const accountsBalanceAtEndOfNextMonth = useMemo(
    () =>
      updateAccountBalances(nextMonthTransactions, accountsBalanceAtEndOfMonth),
    [accountsBalanceAtEndOfMonth, nextMonthTransactions]
  );

  function renderFullRow(content?: string) {
    return (
      <TableRow>
        <TableCell
          colSpan={2 + (accountsQuery.data?.length || 0) + 1}
          className={classes.fullRow}
        >
          {content}
        </TableCell>
      </TableRow>
    );
  }

  function renderBalanceRow(accounts?: Account[]) {
    return (
      <TableRow className={classes.balanceRow}>
        <TableCell />
        <TableCell />
        {accounts?.map((account) => (
          <TableCell key={account.id} className={classes.balance} align="right">
            {Currency.format(account.balance)}
          </TableCell>
        ))}
        <TableCell align="right">
          {Currency.format(
            accounts?.reduce((acc, current) => acc + current.balance, 0) || 0
          )}
        </TableCell>
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
                <TableCell key={account.id} align="right">
                  {account.name}
                </TableCell>
              ))}
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderBalanceRow(accountsQuery.data)}
            {renderFullRow(month.format("MMMM, YYYY"))}
            <TransactionsTable transactions={transactions} />
            {renderBalanceRow(accountsBalanceAtEndOfMonth)}
            {renderFullRow(nextMonth.format("MMMM, YYYY"))}
            <TransactionsTable transactions={nextMonthTransactions} />
            {renderBalanceRow(accountsBalanceAtEndOfNextMonth)}
          </TableBody>
        </Table>
        <FormGroup className={classes.filter} row>
          <FormControlLabel
            control={
              <Checkbox
                checked={displayConfirmed}
                onChange={(event) => setDisplayConfirmed(event.target.checked)}
                color="secondary"
              />
            }
            label="Display Confirmed"
          />
        </FormGroup>
      </TableContainer>
    );
  }

  return <PrivatePage title="Resume">{renderContent()}</PrivatePage>;
}

export default Home;
