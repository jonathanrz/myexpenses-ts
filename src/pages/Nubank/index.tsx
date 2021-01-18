import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PrivatePage from "components/PrivatePage";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Currency from "helpers/currency";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "1fr 1fr 250px",
    display: "grid",
    gridGap: "2rem",
    marginBottom: "2rem",
  },
});

function NubankPage() {
  const classes = useStyles();
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [importingData, setImportingData] = useState(false);
  const [events, setEvents] = useState([]);

  console.log({ events });

  useEffect(() => {
    setUrl(localStorage.getItem("import-data-url") || "");
    setToken(localStorage.getItem("import-data-bearer") || "");
  }, []);

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
      .then(
        ({ events }) =>
          setEvents(events.filter((e: any) => e.category === "transaction")) //TODO: create nubank event type
      )
      .finally(() => setImportingData(false));
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
      {events.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Installments</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((
                e: any //TODO: create nubank event type
              ) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell align="right">
                    {e.details?.charges?.amount || 0}
                  </TableCell>
                  <TableCell align="right">
                    {Currency.format(e.amount)}{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PrivatePage>
  );
}

export default NubankPage;
