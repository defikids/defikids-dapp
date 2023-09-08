export const formatDateToIsoString = (timestamp: number) => {
  const date = new Date(timestamp);

  return date.toISOString().split("T")[0];
};

export const timestampInSeconds = (timestampInMilliseconds: number) =>
  Math.floor(timestampInMilliseconds / 1000);
