import { Moment } from "moment";
import { Account } from "./Account";
import { Bill } from "./Bill";
import { Category } from "./Category";
import { CreditCard } from "./CreditCard";
import { Place } from "./Place";

export interface Expense {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  bill?: Bill;
  category?: Category;
  credit_card?: CreditCard;
  place?: Place;
  date: Moment;
  value: number;
  installmentNumber: string;
  installmentCount: number;
}
