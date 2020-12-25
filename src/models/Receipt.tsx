import { Moment } from "moment";
import { Account } from "./Account";

export interface Receipt {
  id: string;
  name: string;
  confirmed: boolean;
  account?: Account;
  date: Moment;
  value: number;
}
