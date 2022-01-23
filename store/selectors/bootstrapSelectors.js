import { createSelector } from "@reduxjs/toolkit";
import getActiveLng from "@/utils/getActiveLng";

const toSelectOpts = () => (list) => {
  const selectedLng = typeof window !== "undefined" ? getActiveLng() : "ro";

  return list.map((item) => ({ value: String(item.id), label: item[`name_${selectedLng}`] }));
};

export const categoriesOptionsSelector = createSelector(
  (store) => store.bootstrap.payload?.categories || [],
  toSelectOpts()
);
