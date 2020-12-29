import React from "react";
import { Category } from "models/Category";
import useCategoriesQuery from "queries/categories";

interface CategoryCellProps {
  category?: Category;
}

function CategoryCell({ category }: CategoryCellProps) {
  const { query } = useCategoriesQuery();
  if (!category) return <div>No category</div>;
  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>{query.error.message}</div>;

  const data = query.data?.find((a) => a.id === category.id);
  if (!data) return <div>Category not found</div>;
  return <div>{data.name}</div>;
}

export default CategoryCell;
