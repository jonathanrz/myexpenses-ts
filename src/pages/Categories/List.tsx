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
import Form from "./Form";
import CategoryRow from "./CategoryRow";
import { Category } from "../../models/Category";
import useCategoriesQuery from "../../queries/categories";

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
  const { query, deleteMutation } = useCategoriesQuery();

  if (query.isLoading) return <CircularProgress />;
  if (query.isError)
    return <Alert severity="error">{query.error.message}</Alert>;

  function deleteCategory(id: string) {
    if (window.confirm("Delete?")) {
      deleteMutation.mutate(id);
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
            {query.data &&
              query.data.map((category: Category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
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
        <Form />
      </Paper>
    </div>
  );
}

export default CategoriesList;
