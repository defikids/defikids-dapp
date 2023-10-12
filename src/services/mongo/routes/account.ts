import axios from "axios";
import { IAccount } from "@/models/Account";
import mongoose from "mongoose";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const createAccount = async (values: IAccount, wallet: string) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/account/create?wallet=${wallet}`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAccount = async (id: mongoose.Schema.Types.ObjectId) => {
  try {
    const { data } = await axios.get(`/api/mongo/account/get?_id=${id}`);
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
      `/api/mongo/invitation/get?accountId=${accountId}&email=${email}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllAccounts = async () => {
  try {
    const { data } = await axios.get(`/api/mongo/account/getAll`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
