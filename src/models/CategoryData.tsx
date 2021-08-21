import { Category } from "models/Category";
import { CategoryDataItem } from "models/CategoryDataItem";

export interface CategoryData {
  categoryName: string;
  category?: Category;
  items: Array<CategoryDataItem>;
  value: number;
  forecast: number;
}
