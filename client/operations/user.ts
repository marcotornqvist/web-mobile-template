import { useQuery } from "@tanstack/react-query";
import { User } from "types";
import axios from "axios";

// Get all todos
export const useGetMe = () => {
  const getMe = async (): Promise<User> => {
    const result = await axios.get("users/me", {
      withCredentials: true,
    });

    return result.data;
  };

  return useQuery(["me"], getMe, { cacheTime: 0 });
};
