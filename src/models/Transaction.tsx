import { Account } from "./Account";
import { Bill } from "./Bill";
import { Receipt } from "./Receipt";
import { Expense } from "./Expense";

export interface Transaction {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  bill?: Bill;
  day: number;
  value: number;
  receipt?: Receipt;
  expense?: Expense;
}
