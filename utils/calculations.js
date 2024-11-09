export const isProfitMarginAboveThreshold = (retail, wholesale) => {
  const profitMargin = ((retail - wholesale) / retail) * 100;
  return profitMargin >= 10;
};

export const calculateProfitMargin = (retail, wholesale) => {
  return ((retail - wholesale) / retail) * 100;
};

export const roundToTwoDecimals = (num) => {
  return Math.round(num * 100) / 100;
};
