import { createSelector } from "@reduxjs/toolkit";
import toSelectOpts from "@/utils/toSelectOpts";

const selectedLng = localStorage.getItem("i18nextLng") || "ro";

export const categoriesOptionsSelector = createSelector(
  (store) => store.bootstrap.payload?.categories || [],
  toSelectOpts("id", `name_${selectedLng}`)
);
