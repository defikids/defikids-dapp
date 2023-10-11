export const formatDateToIsoString = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
};

export const convertTimestampToSeconds = (timestampInMilliseconds: number) =>
  Math.floor(timestampInMilliseconds / 1000);
