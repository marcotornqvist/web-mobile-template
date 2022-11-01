export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  id: string;
  name: string | null;
  email: string;
  userRole: UserRole;
  createdAt: Date;
  updatedAt: Date | null;
};

export interface AuthToken {
  authorization?: string;
  expiration?: number;
}

export interface AuthResponse {
  user: User;
  authorization: string;
  expiration: number;
}

export interface AuthContextType extends AuthToken {
  isAuth: boolean;
  setAuthToken: (authToken: AuthToken | null) => void;
}

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

export interface UpdateTodoVariables {
  id: string;
  title: string;
}

export interface LoginVariables {
  email: string;
  password: string;
}

export interface RegisterVariables {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateEmailVariables {
  email: string;
  password: string;
}

export interface UpdatePasswordVariables {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
