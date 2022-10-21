export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type User = {
  id: string;
  name: string | null;
  email: string;
  userRole: UserRole;
  createdAt: Date;
  updatedAt: Date | null;
};

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  userId: string;
  createdAt: Date | undefined;
  updatedAt: Date | null;
}

export interface ITodo {
  id: number;
  title: string;
  description: string;
  status: boolean;
}

export interface TodoContextType {
  title: string;
  currentTodo: Todo | null;
  setTitle: (title: string) => void;
  updateTodo: (todo: Todo | null) => void;
}

export interface updateTodoVariables {
  id: string;
  title: string;
}

export interface loginVariables {
  email: string;
  password: string;
}

export interface RegisterVariables {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
