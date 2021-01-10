import React, { useMemo } from "react";
import moment, { Moment } from "moment";
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
  receipt?: boolean;
  expense?: boolean;
}

const useStyles = makeStyles({});

function Home() {
  const classes = useStyles();
  const month = moment();
  const { query: accountsQuery } = useAccountsQuery();
  const { query: receiptsQuery } = useReceiptsQuery(month);
  const { monthQuery: expensesQuery } = useExpensesQuery(month);

  const transactions = useMemo(() => {
    const transactions: Transaction[] = [
      ...(receiptsQuery.data?.map((receipt) => ({
        id: `receipt_${receipt.id}`,
        name: receipt.name,
        confirmed: receipt.confirmed,
        account: receipt.account,
        date: receipt.date,
        value: receipt.value,
        receipt: true,
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
        expense: true,
      })) || []),
    ];

    return sortBy(transactions, "date");
  }, [receiptsQuery.data, expensesQuery.data]);

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
        <Table>
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
                      <ValueCell
                        value={transaction.value}
                        confirmed={transaction.confirmed}
                        receipt={transaction.receipt}
                        expense={transaction.expense}
                      />
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
