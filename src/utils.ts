export const chunk = <T>(array: T[], chunkSize: number): T[][] => array.reduce((accumulator, item, index) => { 
  const chunkIndex = Math.floor(index/chunkSize);

  if (!accumulator[chunkIndex]) {
    accumulator[chunkIndex] = [];
  }

  accumulator[chunkIndex].push(item);

  return accumulator;
}, [] as T[][])
