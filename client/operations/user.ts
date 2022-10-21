import axios, { AxiosResponse } from "axios";
import { User } from "types";

// Get all todos
export const getMe = async (): Promise<User> => {
  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}users/me`,
    {
      withCredentials: true,
    },
  );

  return result.data;
};
