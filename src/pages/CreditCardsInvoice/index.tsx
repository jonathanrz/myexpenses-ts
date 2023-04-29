import React, { useState } from "react";
import moment, { Moment } from "moment";
import { useHistory, useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PrivatePage from "components/PrivatePage";
import MonthTabs from "components/MonthTabs";
import Currency from "helpers/currency";
import useQuery from "queries/creditCardsInvoice";
import CreditCardsInvoiceRow from "./CreditCardsInvoiceRow";

interface CreditCardsInvoicePageParams {
  id: string;
}

const today = moment();

function CreditCardsInvoicePage() {
  const [currentMonth, setCurrentMonth] = useState(today);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const history = useHistory();
  const { id } = useParams<CreditCardsInvoicePageParams>();
  const { query, generateInvoiceMutation } = useQuery(currentMonth, id);

  function handleMonthSelected(event: React.ChangeEvent<{}>, newMonth: Moment) {
    setCurrentMonth(newMonth);
  }

  function generateInvoice() {
    setGeneratingInvoice(true);

    generateInvoiceMutation
      .mutateAsync(id)
      .then(() => history.push("/resume"))
      .finally(() => setGeneratingInvoice(false));
  }

  function renderContent() {
    if (query.isLoading) return <CircularProgress />;
    if (query.isError)
      return <Alert severity="error">{query.error.message}</Alert>;

    return (
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data?.map((expense) => (
            <CreditCardsInvoiceRow key={expense.id} expense={expense} />
          ))}
          <TableRow>
            <TableCell colSpan={3} />
            <TableCell>
              {Currency.format(
                query.data?.reduce((acc, expense) => acc + expense.value, 0) ||
                  0
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <PrivatePage title="Credit Card Invoice">
      <MonthTabs
        currentMonth={currentMonth}
        handleMonthSelected={handleMonthSelected}
      />
      <TableContainer component={Paper}>{renderContent()}</TableContainer>
      <Paper variant="elevation">
        <Button
          variant="contained"
          color="primary"
          onClick={generateInvoice}
          disabled={generatingInvoice}
        >
          {generatingInvoice ? "Generating...." : "Generate Invoice"}
        </Button>
      </Paper>
    </PrivatePage>
  );
}

export default CreditCardsInvoicePage;
