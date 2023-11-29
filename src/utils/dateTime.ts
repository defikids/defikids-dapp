import { DAY_IN_SECONDS } from "./tokenLockerLockTimes";

export const formatDateToIsoString = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
};

export const convertTimestampToSeconds = (timestampInMilliseconds: number) =>
  Math.floor(timestampInMilliseconds / 1000);

export const secondsToDays = (seconds: number) =>
  Math.ceil(seconds / DAY_IN_SECONDS);

export const durationInSecondsRemaining = (
  durationInSeconds: number,
  lockedAtTime: number
) => {
  const nowInSeconds = convertTimestampToSeconds(Date.now());
  const durationElapsed = nowInSeconds - lockedAtTime;

  if (durationElapsed >= durationInSeconds) {
    console.log("no duration left");
    return 0;
  }

  return secondsToDays(durationInSeconds - durationElapsed);
};
