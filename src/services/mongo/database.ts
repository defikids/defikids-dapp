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
      `http://localhost:3000/api/mongo/user/create`,
      JSON.stringify(values),
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
