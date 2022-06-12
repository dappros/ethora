export const normalizeData = (filteredData: any) => {
  const maxValue = Math.max(...filteredData);
  const multiplier = maxValue ** -1;

  return !maxValue
    ? filteredData
    : filteredData.map((val: any) => val * multiplier);
};
