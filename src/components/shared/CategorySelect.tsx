import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Category } from "models/Category";
import useQuery from "queries/categories";

interface CategorySelectProps {
  value: string;
  handleChange: (selectedFieldId?: string) => void;
}

const useStyles = makeStyles({
  menuItemNoneOption: {
    color: "#999999",
  },
});

function CategorySelect({ handleChange, value }: CategorySelectProps) {
  const classes = useStyles();

  const { query } = useQuery();
  const options = useMemo(
    () =>
      query.data?.map((cat: Category) => ({
        label: cat.name,
        value: cat.id,
      })) || [],
    [query.data]
  );

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  return (
    <FormControl fullWidth>
      <InputLabel>Category</InputLabel>
      <Select
        onChange={(e) => handleChange(e.target.value as string)}
        value={value}
        placeholder="Category"
        fullWidth
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        <MenuItem value="" className={classes.menuItemNoneOption}>
          None
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default CategorySelect;
