import { Category } from "models/Category";
import { Expense } from "models/Expense";

export interface CategoryData {
  categoryName: string;
  category?: Category;
  expenses: Array<Expense>;
  value: number;
  forecast: number;
}
