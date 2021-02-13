import { Moment } from "moment";

export interface ReceiptParams {
  id?: string;
  name: string;
  confirmed: boolean;
  account_id?: string;
  date: Moment;
  value: number;
}
