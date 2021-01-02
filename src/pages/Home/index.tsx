import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { makeStyles } from "@material-ui/core/styles";
import PrivatePage from "components/PrivatePage";
import MonthTabs from "components/MonthTabs";
import Accounts from "./Accounts";
import Bills from "./Bills";
import Expenses from "./Expenses";
import Receipts from "./Receipts";

const useStyles = makeStyles({
  container: {
    gridTemplateColumns: "1fr 1fr",
    display: "grid",
    gridTemplateAreas: `
            "monthTab monthTab"
            "accounts bills"
            "receipts expenses"`,
    gridGap: "2rem",
  },
  monthTab: {
    gridArea: "monthTab",
  },
  accounts: {
    gridArea: "accounts",
  },
  bills: {
    gridArea: "bills",
  },
  expenses: {
    gridArea: "expenses",
  },
  receipts: {
    gridArea: "receipts",
  },
});

function Home() {
  const classes = useStyles();
  const [currentMonth, setCurrentMonth] = useState<Moment>();
  useEffect(() => setCurrentMonth(moment()), []);

  function handleMonthSelected(event: React.ChangeEvent<{}>, newMonth: Moment) {
    setCurrentMonth(newMonth);
  }

  if (!currentMonth) return null;

  return (
    <PrivatePage title="Home">
      <div className={classes.container}>
        <div className={classes.monthTab}>
          <MonthTabs
            currentMonth={currentMonth}
            handleMonthSelected={handleMonthSelected}
          />
        </div>
        <div className={classes.accounts}>
          <Accounts />
        </div>
        <div className={classes.bills}>
          <Bills month={currentMonth} />
        </div>
        <div className={classes.expenses}>
          <Expenses month={currentMonth} />
        </div>
        <div className={classes.receipts}>
          <Receipts month={currentMonth} />
        </div>
      </div>
    </PrivatePage>
  );
}

export default Home;
