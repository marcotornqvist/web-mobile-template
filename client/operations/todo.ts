import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Todo, TodoContextType, UpdateTodoVariables } from "types";
import { useContext } from "react";
import { TodoContext } from "context/todoContext";
import axios from "axios";

// Get all todos
export const useGetAllTodosByMe = () => {
  const getTodos = async () => {
    const { data } = await axios.get("todos/me", {
      withCredentials: true,
    });

    return data;
  };

  return useQuery(["todos"], getTodos, {});
};

// Create a new todo
export const useCreateTodo = () => {
  const { setTitle } = useContext(TodoContext) as TodoContextType;
  const queryClient = useQueryClient();

  return useMutation(
    (title) => axios.post("todos", { title }, { withCredentials: true }),
    {
      onMutate: async (title: string) => {
        setTitle("");
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["todos"]);

        // Create optimistic todo
        const optimisticTodo = {
          id: Math.random().toString(36).substring(4),
          title,
        };

        // Optimistically update to the new value
        queryClient.setQueryData<Todo[]>(["todos"], (previous: any) => [
          optimisticTodo,
          ...previous,
        ]);

        return { optimisticTodo };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onSuccess: (result, variables, context) => {
        // Replace optimistic todo in the todos list with the result
        queryClient.setQueryData(["todos"], (previous: any) =>
          previous.map((todo: any) =>
            todo.id === context?.optimisticTodo.id ? result.data : todo,
          ),
        );
      },
      onError: (error, variables, context) => {
        // Remove optimistic todo from the todos list
        queryClient.setQueryData(["todos"], (previous: any) =>
          previous.filter(
            (todo: any) => todo.id !== context?.optimisticTodo.id,
          ),
        );
      },
    },
  );
};

// Update a todo
export const useUpdateTodo = () => {
  const { setTitle } = useContext(TodoContext) as TodoContextType;
  const queryClient = useQueryClient();

  return useMutation(
    ({ title, id }: UpdateTodoVariables) =>
      axios.patch(`todos/${id}`, { title }, { withCredentials: true }),
    {
      onMutate: async ({ title, id }: UpdateTodoVariables) => {
        setTitle("");
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["todos"]);

        const snapshot = await queryClient.getQueryData(["todos"]);

        // Optimistically update to the new value
        queryClient.setQueryData<Todo[]>(["todos"], (previous: any) =>
          previous.map((item: Todo) =>
            item.id === id ? { ...item, title } : item,
          ),
        );

        return { snapshot };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(["todos"], () => context?.snapshot);
      },
    },
  );
};

// Delete a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id) =>
      axios.delete(`todos/${id}`, {
        withCredentials: true,
      }),
    {
      onMutate: async (id: string) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["todos"]);

        const snapshot = await queryClient.getQueryData(["todos"]);

        // Optimistically update to the new value
        queryClient.setQueryData<Todo[]>(["todos"], (previous: any) => {
          return previous.filter((item: Todo) => item.id !== id);
        });

        return { snapshot };
      },
      onError: (error, variables, context) => {
        // Set the previous todo list
        queryClient.setQueryData(["todos"], () => context?.snapshot);
      },
    },
  );
};

// Toggle a todo
export const useToggleIsCompleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id) =>
      axios.patch(`todos/toggleIsCompleted/${id}`, null, {
        withCredentials: true,
      }),
    {
      onMutate: async (id: string) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["todos"]);

        const snapshot = await queryClient.getQueryData(["todos"]);

        // Optimistically update to the new value
        queryClient.setQueryData<Todo[]>(["todos"], (previous: any) =>
          previous.map((item: Todo) =>
            item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
          ),
        );

        return { snapshot };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(["todos"], () => context?.snapshot);
      },
    },
  );
};
