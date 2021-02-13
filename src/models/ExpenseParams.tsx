import { Moment } from "moment";

export interface ExpenseParams {
  id?: string;
  name: string;
  confirmed: boolean;
  account_id?: string;
  bill_id?: string | number;
  category_id?: string;
  credit_card_id?: string | number;
  place_id?: string;
  date: Moment;
  value: number;
  installmentNumber?: string;
  installmentCount?: number;
  nubank_id?: string;
}
