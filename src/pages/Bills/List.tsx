import React from "react";
import moment from "moment";
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
import BillRow from "./BillRow";
import { Bill } from "./model";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "750px 350px",
    display: "grid",
    gridGap: "2rem",
  },
  formContainer: {
    padding: "1rem",
  },
});

function BillsList() {
  const classes = useStyles();

  const axios = useAxios();
  const dataAsync = useAsync(() => {
    return axios.get("bills").then(({ data }) =>
      data.data.map((bill: Bill) => ({
        ...bill,
        init_date: moment(bill.init_date),
        end_date: moment(bill.end_date),
      }))
    );
  });

  if (dataAsync.pending) return <CircularProgress />;
  if (dataAsync.error) return <Alert severity="error">{dataAsync.error}</Alert>;

  const onBillSaved = () => dataAsync.execute();

  function deleteBill(id: string) {
    if (window.confirm("Delete?")) {
      axios.delete(`bills/${id}`).then(() => dataAsync.execute());
    }
  }

  return (
    <div className={classes.container}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Due Day</TableCell>
              <TableCell>Init Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Value</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {dataAsync.result.map((bill: Bill) => (
              <BillRow
                key={bill.id}
                bill={bill}
                axios={axios}
                onBillSaved={onBillSaved}
                deleteBill={deleteBill}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Bill
        </Typography>
        <Form axios={axios} onBillSaved={onBillSaved} />
      </Paper>
    </div>
  );
}

export default BillsList;
