import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { title } from "process";
import { useContext } from "react";
import { TodoContext } from "context/todoContext";
import { loginVariables, Todo, TodoContextType } from "types";

// Login user
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ email, password }: loginVariables) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}auth/login`,
        { email, password },
        { withCredentials: true },
      ),
    {
      onSuccess: (result, variables, context) => {
        queryClient.clear();
        queryClient.setQueryData(["me"], () => {
          return result.data?.user;
        });
        router.push("/");
      },
      onError: (error, variables, context) => {
        // Remove optimistic todo from the todos list
        // queryClient.setQueryData(['todos'], (previous: any) => {
        //   return previous.filter(
        //     (todo: any) => todo.id !== context?.optimisticTodo.id,
        //   );
        // });
      },
    },
  );
};

// Logout user
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(
    () =>
      axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}auth/logout`, null, {
        withCredentials: true,
      }),
    {
      onMutate: async () => {},
      onSuccess: (result, variables, context) => {
        queryClient.clear();
        router.push("/login");
      },
      onError: (error, variables, context) => {},
    },
  );
};
