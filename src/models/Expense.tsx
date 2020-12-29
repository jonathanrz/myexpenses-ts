import { Moment } from "moment";
import { Account } from "./Account";
import { Category } from "./Category";
import { Place } from "./Place";

export interface Expense {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  category?: Category;
  place?: Place;
  date: Moment;
  value: number;
}
