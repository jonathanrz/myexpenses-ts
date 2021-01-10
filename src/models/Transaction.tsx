import { Moment } from "moment";
import { Account } from "./Account";
import { Receipt } from "./Receipt";
import { Expense } from "./Expense";

export interface Transaction {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  date: Moment;
  value: number;
  receipt?: Receipt;
  expense?: Expense;
}
