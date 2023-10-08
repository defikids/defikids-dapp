export const registerActivityEvent = async (
  parentAddress: string,
  memberAddress: string,
  eventDescription: string
) => {
  const key = parentAddress;
  const value = `${memberAddress}::${eventDescription}`;

  try {
    const res = await fetch(
      `/api/vercel/set-recent-activity?key=${key}&value=${value}`
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};
