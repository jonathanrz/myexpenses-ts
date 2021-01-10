import { Moment } from "moment";
import { Account } from "./Account";

export interface Bill {
  id: number;
  name: string;
  account?: Account;
  due_day: number;
  init_date: Moment;
  end_date: Moment;
  value: number;
}
