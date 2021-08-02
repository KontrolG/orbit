export const formatCurrency = (num) => {
  return `$${num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`;
};

export const sleep = (timeInMilliseconds = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeInMilliseconds));
