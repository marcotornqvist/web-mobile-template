import { FC } from "react";
import type { Todo } from "types";
import { useDeleteTodo, useToggleIsCompleteTodo } from "operations/todo";
import styles from "styles/modules/TodoItem.module.scss";
import buttonStyles from "styles/modules/Button.module.scss";

const TodoItem: FC<{
  todo: Todo;
  currentTodoId?: string;
  updateTodo: (currentTodo: Todo | null) => void;
}> = ({ todo, currentTodoId, updateTodo }) => {
  const deleteTodoMutation = useDeleteTodo();
  const toggleIsCompleteTodoMutation = useToggleIsCompleteTodo();

  return (
    <li className={"todo-item " + styles.todo}>
      <h4>{todo.title}</h4>
      <div className="wrapper">
        <button
          className={"toggle-btn " + buttonStyles.button}
          onClick={() => toggleIsCompleteTodoMutation.mutate(todo.id)}
        >
          {todo.isCompleted ? "Done" : "Complete Todo"}
        </button>
        <button
          className={"delete-btn " + buttonStyles.button}
          onClick={() => deleteTodoMutation.mutate(todo.id)}
        >
          Delete
        </button>
        <button
          className={"update-btn " + buttonStyles.button}
          onClick={() => updateTodo(currentTodoId === todo.id ? null : todo)}
        >
          {currentTodoId === todo.id ? "Cancel" : "Edit"}
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
