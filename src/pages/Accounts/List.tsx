import React from "react";
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
import useAxios from "../../hooks/useAxios";
import useAsync from "../../hooks/useAsync";
import Form from "./Form";
import AccountRow from "./AccountRow";
import { Account } from "./model";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "450px 350px",
    display: "grid",
    gridGap: "2rem",
  },
  formContainer: {
    padding: "1rem",
  },
});

function Accounts() {
  const classes = useStyles();

  const axios = useAxios();
  const dataAsync = useAsync(() => {
    return axios.get("accounts").then(({ data }) => data.data);
  });

  if (dataAsync.pending) return <CircularProgress />;
  if (dataAsync.error) return <Alert severity="error">{dataAsync.error}</Alert>;

  const onAccountSaved = () => dataAsync.execute();

  return (
    <div className={classes.container}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {dataAsync.result.map((account: Account) => (
              <AccountRow
                key={account.id}
                account={account}
                axios={axios}
                onAccountSaved={onAccountSaved}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Account
        </Typography>
        <Form axios={axios} onAccountSaved={onAccountSaved} />
      </Paper>
    </div>
  );
}

export default Accounts;
