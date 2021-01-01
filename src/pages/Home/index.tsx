import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import PrivatePage from "components/PrivatePage";
import MonthTabs from "components/MonthTabs";
import Accounts from "./Accounts";
import Bills from "./Bills";
import Expenses from "./Expenses";
import Receipts from "./Receipts";

function Home() {
  const [currentMonth, setCurrentMonth] = useState<Moment>();
  useEffect(() => setCurrentMonth(moment()), []);

  function handleMonthSelected(event: React.ChangeEvent<{}>, newMonth: Moment) {
    setCurrentMonth(newMonth);
  }

  if (!currentMonth) return null;

  return (
    <PrivatePage title="Home">
      <MonthTabs
        currentMonth={currentMonth}
        handleMonthSelected={handleMonthSelected}
      />
      <Accounts />
      <Bills month={currentMonth} />
      <Expenses month={currentMonth} />
      <Receipts month={currentMonth} />
    </PrivatePage>
  );
}

export default Home;
