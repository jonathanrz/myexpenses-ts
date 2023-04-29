import { Moment } from "moment";
import { Account } from "./Account";
import { Bill } from "./Bill";
import { Category } from "./Category";
import { CreditCard } from "./CreditCard";

export interface Expense {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  bill?: Bill;
  category?: Category;
  credit_card?: CreditCard;
  date: Moment;
  value: number;
  installmentNumber: string;
  installmentCount: number;
  nubank_id: string;
}
