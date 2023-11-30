import axios from "axios";
import mongoose from "mongoose";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const HOST = process.env.HOST || "";

export const createInvitation = async (values: any) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/invitation/create`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllInvitations = async () => {
  try {
    const { data } = await axios.get(`${HOST}/api/mongo/invitation/getAll`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteInvitation = async (id: mongoose.Schema.Types.ObjectId) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/invitation/delete`,
      JSON.stringify({ id }),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getInvitation = async (
  accountId: mongoose.Schema.Types.ObjectId,
  email: string
) => {
  try {
    const { data } = await axios.get(
      `${HOST}/api/mongo/invitation/get?accountId=${accountId}&email=${email}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
