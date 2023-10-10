import axios from "axios";
import { IUser } from "@/models/User";
import { IAccount } from "@/models/Account";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const createUser = async (values: IUser) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/user/create`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
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

export const getUserByWalletAddress = async (walletAddress: string) => {
  try {
    const { data } = await axios.get(
      `/api/mongo/user/get?walletAddress=${walletAddress}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`/api/mongo/user/getAll`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const editUser = async (values: any) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/user/edit`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
