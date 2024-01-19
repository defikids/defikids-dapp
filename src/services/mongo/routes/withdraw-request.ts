import { IWithdrawRequest } from "@/models/WithdrawRequest";
import axios from "axios";
import mongoose from "mongoose";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const HOST = process.env.HOST || "";

export const createWithdrawRequest = async (values: any) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/withdraw-request/create`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllWithdrawRequestsByAccountId = async (
  accountId: mongoose.Schema.Types.ObjectId
) => {
  try {
    const { data } = await axios.get(
      `${HOST}/api/mongo/withdraw-request/getAll`
    );

    return data.filter((withdrawRequest: IWithdrawRequest) => {
      return withdrawRequest.accountId === accountId;
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteRequest = async (id: mongoose.Schema.Types.ObjectId) => {
  try {
    const { data } = await axios.post(
      `${HOST}/api/mongo/withdraw-request/delete`,
      JSON.stringify({ id }),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
