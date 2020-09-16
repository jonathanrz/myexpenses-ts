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
import CategoryRow from "./CategoryRow";
import { Category } from "./model";

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

function CategoriesList() {
  const classes = useStyles();

  const axios = useAxios();
  const dataAsync = useAsync(() => {
    return axios.get("categories").then(({ data }) => data.data);
  });

  if (dataAsync.pending) return <CircularProgress />;
  if (dataAsync.error) return <Alert severity="error">{dataAsync.error}</Alert>;

  const onCategorySaved = () => dataAsync.execute();

  function deleteCategory(id: string) {
    if (window.confirm("Delete?")) {
      axios.delete(`categories/${id}`).then(() => dataAsync.execute());
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
            {dataAsync.result.map((category: Category) => (
              <CategoryRow
                key={category.id}
                category={category}
                axios={axios}
                onCategorySaved={onCategorySaved}
                deleteCategory={deleteCategory}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          New Category
        </Typography>
        <Form axios={axios} onCategorySaved={onCategorySaved} />
      </Paper>
    </div>
  );
}

export default CategoriesList;
