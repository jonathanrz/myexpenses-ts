import React, { useMemo } from "react";
import moment from "moment";
import sortBy from "lodash/sortBy";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Currency from "helpers/currency";
import { Account } from "models/Account";
import { Receipt } from "models/Receipt";
import { Expense } from "models/Expense";
import { Transaction } from "models/Transaction";
import PrivatePage from "components/PrivatePage";
import useAccountsQuery from "queries/accounts";
import useExpensesQuery from "queries/expenses";
import useReceiptsQuery from "queries/receipts";
import TransactionsTable from "./TransactionsTable";

const useStyles = makeStyles({
  balance: {
    fontWeight: "bold",
  },
  balanceRow: {
    "&:nth-of-type(even)": {
      backgroundColor: "#EEEEEE",
    },
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

function generateTransactions(
  receipts?: Receipt[],
  expenses?: Expense[]
): Transaction[] {
  return [
    ...(receipts?.map((receipt) => ({
      id: `receipt_${receipt.id}`,
      name: receipt.name,
      confirmed: receipt.confirmed,
      account: receipt.account,
      date: receipt.date,
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
      date: expense.date,
      value: expense.value,
      expense,
    })) || []),
  ];
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
  const { query: accountsQuery } = useAccountsQuery();
  const { query: receiptsQuery } = useReceiptsQuery(month);
  const { monthQuery: expensesQuery } = useExpensesQuery(month);
  const { query: nextMonthReceiptsQuery } = useReceiptsQuery(nextMonth);
  const { monthQuery: nextMonthExpensesQuery } = useExpensesQuery(nextMonth);

  const transactions = useMemo(
    () =>
      sortBy(
        generateTransactions(receiptsQuery.data, expensesQuery.data),
        "date"
      ),
    [receiptsQuery.data, expensesQuery.data]
  );

  const nextMonthTransactions = useMemo(
    () =>
      sortBy(
        generateTransactions(
          nextMonthReceiptsQuery.data,
          nextMonthExpensesQuery.data
        ),
        "date"
      ),
    [nextMonthReceiptsQuery.data, nextMonthExpensesQuery.data]
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
          colSpan={2 + (accountsQuery.data?.length || 0)}
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
          <TableCell key={account.id} className={classes.balance}>
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
            {renderBalanceRow(accountsQuery.data)}
            {renderFullRow(month.format("MMMM, YYYY"))}
            <TransactionsTable transactions={transactions} />
            {renderBalanceRow(accountsBalanceAtEndOfMonth)}
            {renderFullRow(nextMonth.format("MMMM, YYYY"))}
            <TransactionsTable transactions={nextMonthTransactions} />
            {renderBalanceRow(accountsBalanceAtEndOfNextMonth)}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return <PrivatePage title="Resume">{renderContent()}</PrivatePage>;
}

export default Home;
