import React from "react";
import { Moment } from "moment";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

interface MonthTabsProps {
  currentMonth: Moment;
  handleMonthSelected: (event: React.ChangeEvent<{}>, newValue: Moment) => void;
}

function MonthTabs({ currentMonth, handleMonthSelected }: MonthTabsProps) {
  function renderTab(value: Moment) {
    return <Tab label={value.format("MMMM, YYYY")} value={value}></Tab>;
  }

  return (
    <Tabs
      value={currentMonth}
      onChange={handleMonthSelected}
      indicatorColor="primary"
      textColor="primary"
      centered
    >
      {renderTab(currentMonth.clone().subtract(3, "month"))}
      {renderTab(currentMonth.clone().subtract(2, "month"))}
      {renderTab(currentMonth.clone().subtract(1, "month"))}
      {renderTab(currentMonth)}
      {renderTab(currentMonth.clone().add(1, "month"))}
      {renderTab(currentMonth.clone().add(2, "month"))}
      {renderTab(currentMonth.clone().add(3, "month"))}
    </Tabs>
  );
}

export default MonthTabs;
