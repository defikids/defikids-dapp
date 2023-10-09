import axios from "axios";
import { IUser } from "@/models/User";

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

export const createAccount = async (values: any) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/account/create`,
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
