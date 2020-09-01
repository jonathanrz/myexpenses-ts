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
import PlaceRow from "./PlaceRow";
import { Place } from "./model";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "550px 350px",
    display: "grid",
    gridGap: "2rem",
  },
  formContainer: {
    padding: "1rem",
  },
});

function PlacesList() {
  const classes = useStyles();

  const axios = useAxios();
  const dataAsync = useAsync(() => {
    return axios.get("places").then(({ data }) => data.data);
  });

  if (dataAsync.pending) return <CircularProgress />;
  if (dataAsync.error) return <Alert severity="error">{dataAsync.error}</Alert>;

  const onPlaceSaved = () => dataAsync.execute();

  function deletePlace(id: string) {
    if (window.confirm("Delete?")) {
      axios.delete(`places/${id}`).then(() => dataAsync.execute());
    }
  }

  return (
    <div className={classes.container}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {dataAsync.result.map((place: Place) => (
              <PlaceRow
                key={place.id}
                place={place}
                axios={axios}
                onPlaceSaved={onPlaceSaved}
                deletePlace={deletePlace}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Place
        </Typography>
        <Form axios={axios} onPlaceSaved={onPlaceSaved} />
      </Paper>
    </div>
  );
}

export default PlacesList;
