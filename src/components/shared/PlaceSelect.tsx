import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Place } from "models/Place";
import useQuery from "queries/places";

interface PlaceSelectProps {
  value: string;
  handleChange: (selectedFieldId?: string) => void;
}

const useStyles = makeStyles({
  menuItemNoneOption: {
    color: "#999999",
  },
});

function PlaceSelect({ handleChange, value }: PlaceSelectProps) {
  const classes = useStyles();

  const { query } = useQuery();
  const options = useMemo(
    () =>
      query.data?.map((place: Place) => ({
        label: place.name,
        value: place.id,
      })) || [],
    [query.data]
  );

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  return (
    <FormControl fullWidth>
      <InputLabel>Place</InputLabel>
      <Select
        onChange={(e) => handleChange(e.target.value as string)}
        value={value}
        placeholder="Place"
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

export default PlaceSelect;
