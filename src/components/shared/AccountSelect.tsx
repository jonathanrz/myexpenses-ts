import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Account } from "models/Account";
import useAccountsQuery from "queries/accounts";

interface AccountSelectProps {
  name?: string;
  label?: string;
  value: string;
  handleChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles({
  menuItemNoneOption: {
    color: "#999999",
  },
});

function AccountSelect({
  name,
  label = "Account",
  handleChange,
  value,
}: AccountSelectProps) {
  const classes = useStyles();

  const { query } = useAccountsQuery();
  const options = useMemo(
    () =>
      query.data?.map((account: Account) => ({
        label: account.name,
        value: account.id,
      })) || [],
    [query.data]
  );

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        onChange={handleChange}
        value={value}
        placeholder={label}
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

export default AccountSelect;
