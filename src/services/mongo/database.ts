import axios from "axios";
import { IUser } from "@/models/User";
import { IAccount } from "@/models/Account";
import mongoose from "mongoose";

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

export const editUser = async (
  id: mongoose.Schema.Types.ObjectId,
  values: any
) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/user/edit?_id=${id}`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createInvitation = async (values: any) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/invitation/create`,
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
    const { data } = await axios.get(`/api/mongo/invitation/getAll`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteInvitation = async (id: mongoose.Schema.Types.ObjectId) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/invitation/delete`,
      JSON.stringify({ id }),
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

export const editPermissions = async (
  id: mongoose.Schema.Types.ObjectId,
  wallet: string,
  permissions: string[]
) => {
  try {
    const { data } = await axios.post(
      `/api/mongo/permissions/edit?_id=${id}&wallet=${wallet}`,
      JSON.stringify({ permissions }),
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
      `/api/mongo/user/delete`,
      JSON.stringify({ id }),
      config
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
