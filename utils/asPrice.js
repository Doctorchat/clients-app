export const asPrice = (price, precision = 2) => {
  return Number(price).toFixed(precision);
};
