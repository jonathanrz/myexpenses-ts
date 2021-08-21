import { Moment } from "moment";
import { Category } from "models/Category";
import { Expense } from "models/Expense";
import { Place } from "models/Place";

export interface CategoryDataItem {
  id: string;
  date?: Moment;
  name: string;
  categoryName: string;
  category?: Category;
  expense?: Expense;
  placeName: string;
  place?: Place;
  value: number;
}
