// contains common methods
export const countDuplicateItemsInArray = (
  arr: {key: string}[],
): {key: string; count: number}[] => {
  // Count occurrences of each key
  const counts = arr.reduce((acc, item) => {
    acc[item.key] = (acc[item.key] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});

  // Convert counts object to array of objects with key and count
  return Object.keys(counts).map(key => ({key, count: counts[key]}));
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDateYearsMonthsDates = (inputDate: string): string => {
  const [day, month, year] = inputDate.split('/');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
