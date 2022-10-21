import { createContext, FC, ReactNode, useState } from 'react';
import { TodoContextType, ITodo, Todo } from 'types';

export const TodoContext = createContext<TodoContextType | null>(null);

const TodoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<string>('');
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const updateTodo = (todo: Todo | null) => {
    if (todo) {
      setCurrentTodo(todo);
      setTitle(todo.title);
    } else {
      setCurrentTodo(null);
      setTitle('');
    }
  };

  return (
    <TodoContext.Provider value={{ title, setTitle, currentTodo, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
