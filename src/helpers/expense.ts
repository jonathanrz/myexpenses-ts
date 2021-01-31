import { Expense } from "models/Expense";

function renderExpenseName(expense: Expense) {
  return expense.installmentNumber
    ? `${expense.name} ${expense.installmentNumber}/${expense.installmentCount}`
    : expense.name;
}

export { renderExpenseName };
