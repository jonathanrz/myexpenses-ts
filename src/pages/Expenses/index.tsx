import React from "react";
import PrivatePage from "../../components/PrivatePage";
import List from "./List";

function ExpensePage() {
  return (
    <PrivatePage title="Expenses">
      <List />
    </PrivatePage>
  );
}

export default ExpensePage;
