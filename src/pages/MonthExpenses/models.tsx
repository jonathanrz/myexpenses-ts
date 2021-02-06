import { Category } from "models/Category";
import { Expense } from "models/Expense";
import { Place } from "models/Place";

export interface CategoryDataItem {
  id: string;
  name: string;
  categoryName: string;
  category?: Category;
  expense?: Expense;
  place?: Place;
  value: number;
}

export interface CategoryData {
  categoryName: string;
  category?: Category;
  items: Array<CategoryDataItem>;
  value: number;
  forecast: number;
}
