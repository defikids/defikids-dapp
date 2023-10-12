import axios from "axios";
import mongoose from "mongoose";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
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
