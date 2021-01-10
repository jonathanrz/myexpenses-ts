import React from "react";
import moment, { Moment } from "moment";
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
import PrivatePage from "components/PrivatePage";
import useAccountsQuery from "queries/accounts";
import useReceiptsQuery from "queries/receipts";

const useStyles = makeStyles({});

function Home() {
  const classes = useStyles();
  const month = moment();
  const { query: accountsQuery } = useAccountsQuery();
  const { query: receiptsQuery } = useReceiptsQuery(month);

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
            {receiptsQuery.data?.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>{receipt.name}</TableCell>
                <TableCell>{receipt.date.format("DD")}</TableCell>
                {accountsQuery.data?.map((account) => (
                  <TableCell key={account.id}>
                    {account.id === receipt.account?.id
                      ? Currency.format(receipt.value)
                      : ""}
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
