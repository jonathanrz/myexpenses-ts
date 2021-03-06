import React from "react";
import { QueryObserverResult, UseMutationResult } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Account } from "models/Account";
import useAccountsQuery from "queries/accounts";
import Form from "./Form";
import AccountRow from "./AccountRow";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "550px 350px",
    display: "grid",
    gridGap: "2rem",
  },
  formContainer: {
    padding: "1rem",
  },
  table: {
    padding: "1rem 2rem 2rem",
    width: "unset",
  },
});

interface AccountsListProps {
  accountQuery: {
    query: QueryObserverResult<Account[], Error>;
    deleteMutation: UseMutationResult<void, Error, String>;
  };
}

export function AccountsList({ accountQuery }: AccountsListProps) {
  const classes = useStyles();
  const { query, deleteMutation } = accountQuery;

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function deleteAccount(id: string) {
    if (window.confirm("Delete?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className={classes.container}>
      <TableContainer className={classes.table} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {query.data &&
              query.data.map((account: Account) => (
                <AccountRow
                  key={account.id}
                  account={account}
                  deleteAccount={deleteAccount}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Account
        </Typography>
        <Form />
      </Paper>
    </div>
  );
}

function AccountsListQueried() {
  const query = useAccountsQuery();

  return <AccountsList accountQuery={query} />;
}

export default AccountsListQueried;
