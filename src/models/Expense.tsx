import { Moment } from "moment";
import { Account } from "./Account";
import { Place } from "./Place";

export interface Expense {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  place?: Place;
  date: Moment;
  value: number;
}
