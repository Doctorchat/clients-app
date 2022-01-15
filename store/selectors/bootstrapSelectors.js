import { createSelector } from "@reduxjs/toolkit";

const toSelectOpts = () => (list) => {
  const selectedLng = (window && localStorage.getItem("i18nextLng")) || "ro";

  return list.map((item) => ({ value: String(item.id), label: item[`name_${selectedLng}`] }));
};

export const categoriesOptionsSelector = createSelector(
  (store) => store.bootstrap.payload?.categories || [],
  toSelectOpts()
);
