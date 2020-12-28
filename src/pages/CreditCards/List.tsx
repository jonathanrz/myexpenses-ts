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
import { CreditCard } from "models/CreditCard";
import useCreditCardsQuery from "queries/creditCards";
import Form from "./Form";
import CreditCardRow from "./CreditCardRow";

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

function CreditCardList() {
  const classes = useStyles();
  const { query, deleteMutation } = useCreditCardsQuery();

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function deleteCreditCard(id: string) {
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
              <TableCell>Account</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {query.data &&
              query.data.map((creditCard: CreditCard) => (
                <CreditCardRow
                  key={creditCard.id}
                  creditCard={creditCard}
                  deleteCreditCard={deleteCreditCard}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Credit Card
        </Typography>
        <Form />
      </Paper>
    </div>
  );
}

export default CreditCardList;
