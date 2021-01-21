import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import keyBy from "lodash/keyBy";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PrivatePage from "components/PrivatePage";
import useNubankQuery from "queries/nubank";
import { NubankEvent } from "models/NubankEvent";
import NubankEventRow from "./NubankEventRow";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "1fr 1fr 250px",
    display: "grid",
    gridGap: "2rem",
    marginBottom: "2rem",
  },
});

const today = moment();

function NubankPage() {
  const classes = useStyles();
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [importingData, setImportingData] = useState(false);
  const [events, setEvents] = useState<NubankEvent[]>([]);
  const { query } = useNubankQuery();

  useEffect(() => {
    setUrl(localStorage.getItem("import-data-url") || "");
    setToken(localStorage.getItem("import-data-bearer") || "");
  }, []);

  const eventsFiltered = useMemo(() => {
    if (!events.length) return [];
    if (!query.data) return events;

    const expenses = keyBy(query.data, "nubank_id");

    return events.filter((e: NubankEvent) => !expenses[e.id]);
  }, [events, query.data]);

  function importData() {
    setImportingData(true);

    localStorage.setItem("import-data-url", url);
    localStorage.setItem("import-data-bearer", token);

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(({ events }) =>
        setEvents(
          events
            .filter((e: NubankEvent) => e.category === "transaction")
            .map((e: NubankEvent) => ({ ...e, time: moment(e.time) }))
            .filter((e: NubankEvent) => today.diff(e.time, "months") < 11)
        )
      )
      .finally(() => setImportingData(false));
  }

  function renderTable() {
    if (query.isLoading) return <CircularProgress />;
    if (query.isError)
      return <Alert severity="error">{query.error.message}</Alert>;

    if (events.length === 0) return null;
    if (eventsFiltered.length === 0)
      return <div>No new events found in nubank database</div>;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Installments</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventsFiltered.map((e) => (
              <NubankEventRow key={e.id} event={e} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <PrivatePage title="Home">
      <div className={classes.container}>
        <TextField
          label="url"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />
        <TextField
          label="token"
          variant="outlined"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          fullWidth
        />
        <Button
          color="secondary"
          variant="contained"
          disabled={Boolean(!url || !token || importingData)}
          onClick={importData}
        >
          {importingData ? "Importing..." : "Import Data"}
        </Button>
      </div>
      {renderTable()}
    </PrivatePage>
  );
}

export default NubankPage;
