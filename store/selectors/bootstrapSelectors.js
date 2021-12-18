import { createSelector } from "@reduxjs/toolkit";

export const categoriesOptionsSelector = createSelector(
  (store) => store.bootstrap.payload?.categories || [],
  (categories) => categories.map((category) => ({ value: category.id, label: category.name_ro }))
);
