import React from "react";
import numbro from "numbro";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import useAxios from "../../hooks/useAxios";
import useAsync from "../../hooks/useAsync";

interface Account {
  id: string;
  name: string;
  balance: number;
}

const useStyles = makeStyles({
  container: {
    maxWidth: 650,
  },
});

function Accounts() {
  const classes = useStyles();

  const axios = useAxios();
  const data = useAsync(() => {
    return axios.get("accounts").then(({ data }) => data.data);
  });

  if (data.pending) return <CircularProgress />;
  if (data.error) return <Alert severity="error">{data.error}</Alert>;

  console.log({ data });

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.result.map((account: Account) => (
            <TableRow key={account.id}>
              <TableCell component="th" scope="row">
                {account.name}
              </TableCell>
              <TableCell align="right">
                {numbro(account.balance / 100).formatCurrency({ mantissa: 2 })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Accounts;
