import { Moment } from "moment";
import { Account } from "./Account";
import { Category } from "./Category";

export interface Bill {
  id: number;
  name: string;
  account?: Account;
  category?: Category;
  due_day: number;
  init_date: Moment;
  end_date: Moment;
  value: number;
}
