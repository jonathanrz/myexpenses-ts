import { Moment } from "moment";

export interface Bill {
  id: number;
  name: string;
  due_day: number;
  init_date: Moment;
  end_date: Moment;
  value: number;
}
