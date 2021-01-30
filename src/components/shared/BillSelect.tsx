import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Bill } from "models/Bill";
import useQuery from "queries/bills";

interface BillSelectProps {
  value: string;
  handleChange: (selectedFieldId?: string) => void;
}

const useStyles = makeStyles({
  menuItemNoneOption: {
    color: "#999999",
  },
});

function BillSelect({ handleChange, value }: BillSelectProps) {
  const classes = useStyles();

  const { query } = useQuery();
  const options = useMemo(
    () =>
      query.data?.map((cat: Bill) => ({
        label: cat.name,
        value: cat.id,
      })) || [],
    [query.data]
  );

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  return (
    <FormControl fullWidth>
      <InputLabel>Bill</InputLabel>
      <Select
        onChange={(e) => handleChange(e.target.value as string)}
        value={value}
        placeholder="Bill"
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

export default BillSelect;
