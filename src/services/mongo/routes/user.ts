import axios from "axios";
import { IUser } from "@/models/User";
import mongoose from "mongoose";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const HOST = process.env.NEXT_PUBLIC_HOST || "";

export const createUser = async (values: IUser) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/user/create`,
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
      `${HOST}/api/mongo/user/get?walletAddress=${walletAddress}`
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

export const editUser = async (
  id: mongoose.Schema.Types.ObjectId,
  values: any
) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/user/edit?_id=${id}`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteUser = async (id: mongoose.Schema.Types.ObjectId) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/user/delete`,
      JSON.stringify({ id }),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
