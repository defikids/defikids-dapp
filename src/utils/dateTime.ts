export const formatDateToIsoString = (timestamp: number) => {
  const date = new Date(timestamp);

  return date.toISOString().split("T")[0];
};

export const timestampInSeconds = (timestampInMilliseconds: number) =>
  Math.floor(timestampInMilliseconds / 1000);

export const dateInSecondsToLongDate = (date: string) => {
  const dateInSeconds = parseInt(date);
  const dateInMilliseconds = dateInSeconds * 1000;
  const dateObject = new Date(dateInMilliseconds);
  return dateObject.toLocaleDateString();
};
