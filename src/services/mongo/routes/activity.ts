import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const HOST = process.env.HOST || "";

export const createActivity = async (values: any) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/activity/create`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllActivity = async () => {
  try {
    const { data } = await axios.get(`${HOST}/api/mongo/activity/getAll`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
