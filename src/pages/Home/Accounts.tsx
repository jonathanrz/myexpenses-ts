import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Currency from "helpers/currency";
import { Account } from "models/Account";
import useAccountsQuery from "queries/accounts";

function Accounts() {
  const { query } = useAccountsQuery();

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data &&
            query.data.map((account: Account) => (
              <TableRow key={account.id}>
                <TableCell component="th" scope="row">
                  {account.name}
                </TableCell>
                <TableCell align="right">
                  {Currency.format(account.balance)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Accounts;
