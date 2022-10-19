import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

const mockTodo: Todo = {
  id: '01e3f65e-fd2c-4f90-894a-fffa8f41c39c',
  title: 'Drink coffee.',
  isCompleted: false,
  userId: '74783f1d-22a1-4cb8-bb80-dff508883a23',
  createdAt: new Date('2022-10-10T08:05:01.731Z'),
  updatedAt: new Date('2022-10-10T08:05:01.731Z'),
};

const mockUser: User = {
  id: '74783f1d-22a1-4cb8-bb80-dff508883a23',
  name: 'Sam Smith',
  email: 'sam@gmail.com',
  userRole: 'USER',
  createdAt: new Date('2022-10-17T15:31:50.629Z'),
  updatedAt: new Date('2022-10-17T15:31:50.629Z'),
};

describe('TodoService', () => {
  let todosController: TodosController;
  let todosService: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            getAllTodos: jest.fn().mockReturnValue([mockTodo]),
            getAllTodosByMe: jest.fn().mockReturnValue([mockTodo]),
            createTodo: jest.fn().mockReturnValue(mockTodo),
            updateTodo: jest.fn().mockReturnValue(mockTodo),
            toggleIsCompletedTodo: jest.fn().mockReturnValue(true),
            deleteTodo: jest.fn().mockReturnValue(true),
          },
        },
        PrismaService,
      ],
    }).compile();

    todosController = module.get<TodosController>(TodosController);
    todosService = module.get<TodosService>(TodosService);
  });

  describe('getAllTodos', () => {
    it('should call prisma todosController.getAllTodos and return a list of todos.', async () => {
      const mockGetAllTodos = jest.fn().mockReturnValue([mockTodo]);

      jest
        .spyOn(todosService, 'getAllTodos')
        .mockImplementation(mockGetAllTodos);

      await todosController.getAllTodos();

      expect(mockGetAllTodos).toBeCalledWith();
    });
  });

  describe('getAllTodosByMe', () => {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todosController.getAllTodosByMe and return a list of todos by logged in user.', async () => {
      const mockGetAllTodosByMe = jest.fn().mockReturnValue([mockTodo]);

      jest
        .spyOn(todosService, 'getAllTodosByMe')
        .mockImplementation(mockGetAllTodosByMe);

      await todosController.getAllTodosByMe(mockUser);

      expect(mockGetAllTodosByMe).toBeCalledWith(userId);
    });
  });

  describe('createTodo', () => {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';
    const title = 'Drink coffee.';

    it('should call prisma todosController.createTodo and create a new todo.', async () => {
      const mockCreateTodo = jest.fn().mockReturnValue(mockTodo);

      jest.spyOn(todosService, 'createTodo').mockImplementation(mockCreateTodo);

      await todosController.createTodo(mockUser, { title });

      expect(mockCreateTodo).toBeCalledWith(userId, { title });
    });
  });

  describe('updateTodo', () => {
    const title = 'Drink coffeeafefefe.';
    const id = '01e3f65e-fd2c-4f90-894a-fffa8f41c39c';
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todosController.updateTodo and update todo.', async () => {
      const mockUpdateTodo = jest.fn().mockReturnValue(mockTodo);

      jest.spyOn(todosService, 'updateTodo').mockImplementation(mockUpdateTodo);

      await todosController.updateTodo(mockUser, id, { title });

      expect(mockUpdateTodo).toBeCalledWith(userId, id, { title });
    });
  });

  describe('toggleIsCompletedTodo', () => {
    const id = '01e3f65e-fd2c-4f90-894a-fffa8f41c39c';
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todosController.toggleIsCompletedTodo and toggle todo isCompleted state.', async () => {
      const mockToggleIsCompletedTodo = jest.fn().mockReturnValue(true);

      jest
        .spyOn(todosService, 'toggleIsCompletedTodo')
        .mockImplementation(mockToggleIsCompletedTodo);

      await todosController.toggleIsCompletedTodo(mockUser, id);

      expect(mockToggleIsCompletedTodo).toBeCalledWith(userId, id);
    });
  });

  describe('deleteTodo', () => {
    const id = '01e3f65e-fd2c-4f90-894a-fffa8f41c39c';
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todo.deleteTodo and toggle todo isCompleted state.', async () => {
      const mockDeleteTodo = jest.fn().mockReturnValue(true);

      jest.spyOn(todosService, 'deleteTodo').mockImplementation(mockDeleteTodo);

      await todosService.deleteTodo(userId, id);

      expect(mockDeleteTodo).toBeCalledWith(userId, id);
    });
  });
});
