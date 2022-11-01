import { FC, useContext, useEffect } from "react";
import type { Todo, TodoContextType } from "types";
import { TodoContext } from "context/todoContext";
import { useGetAllTodosByMe } from "operations/todo";
import TodoItem from "./TodoItem";

const Todos: FC = () => {
  const { currentTodo, updateTodo } = useContext(
    TodoContext,
  ) as TodoContextType;

  const { data, isLoading, error } = useGetAllTodosByMe();
  // if (isLoading) return <div>Loading</div>;
  // if (error) return <div>An error has occurred: {error}</div>;

  return (
    <ul className="todos">
      {data?.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          currentTodoId={currentTodo?.id}
          updateTodo={updateTodo}
        />
      ))}
    </ul>
  );
};

export default Todos;
