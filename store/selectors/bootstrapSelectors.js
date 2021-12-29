import { createSelector } from "@reduxjs/toolkit";
import toSelectOpts from "@/utils/toSelectOpts";

export const categoriesOptionsSelector = createSelector(
  (store) => store.bootstrap.payload?.categories || [],
  toSelectOpts("id", "name_ro")
);
