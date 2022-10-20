import {
  CACHE_MANAGER,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TodosService } from './todos.service';

const mockTodo: Todo = {
  id: '01e3f65e-fd2c-4f90-894a-fffa8f41c39c',
  title: 'Drink coffee.',
  isCompleted: false,
  userId: '74783f1d-22a1-4cb8-bb80-dff508883a23',
  createdAt: new Date('2022-10-10T08:05:01.731Z'),
  updatedAt: new Date('2022-10-10T08:05:01.731Z'),
};

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('TodoService', () => {
  let todosService: TodosService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            todo: {
              findMany: jest.fn().mockReturnValue([mockTodo]),
              create: jest.fn().mockReturnValue(mockTodo),
              update: jest.fn().mockReturnValue(mockTodo),
              delete: jest.fn().mockReturnValue(null),
              findUnique: jest.fn().mockReturnValue(mockTodo),
            },
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        TodosService,
      ],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllTodos', () => {
    it('should call prisma todo.findMany and return todos in descending order.', async () => {
      const mockFindManyTodos = jest.fn().mockReturnValue([mockTodo]);

      jest
        .spyOn(prismaService.todo, 'findMany')
        .mockImplementation(mockFindManyTodos);

      await todosService.getAllTodos();

      expect(mockFindManyTodos).toBeCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('getAllTodosByMe', () => {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todo.findMany and return todos from logged in user.', async () => {
      const mockFindManyTodosByMe = jest.fn().mockReturnValue([mockTodo]);

      jest
        .spyOn(prismaService.todo, 'findMany')
        .mockImplementation(mockFindManyTodosByMe);

      await todosService.getAllTodosByMe(userId);

      expect(mockFindManyTodosByMe).toBeCalledWith({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('createTodo', () => {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todo.createTodo and create a single todo.', async () => {
      const mockCreateTodo = jest.fn().mockReturnValue(mockTodo);

      jest
        .spyOn(prismaService.todo, 'create')
        .mockImplementation(mockCreateTodo);

      await todosService.createTodo(userId, {
        title: mockTodo.title,
      });

      expect(mockCreateTodo).toBeCalledWith({
        data: {
          title: mockTodo.title,
          userId,
        },
      });
    });
  });

  describe('updateTodo', () => {
    const id = '01e3f65e-fd2c-4f90-894a-fffa8f41c39c';
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';
    const newTitle = 'New title for todo';

    it('should call prisma todo.updateTodo and update a single todo.', async () => {
      const mockUpdateTodo = jest.fn().mockReturnValue(mockTodo);

      jest
        .spyOn(prismaService.todo, 'update')
        .mockImplementation(mockUpdateTodo);

      jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockImplementation(mockUpdateTodo);

      await todosService.updateTodo(userId, id, {
        title: newTitle,
      });

      expect(mockUpdateTodo).toBeCalledWith({
        where: {
          id,
        },
        data: {
          title: newTitle,
        },
      });
    });

    it('should return error if no todo exist.', async () => {
      const mockUpdateTodo = jest.fn().mockReturnValue(null);

      jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockImplementation(mockUpdateTodo);

      await expect(
        todosService.updateTodo(userId, id, { title: 'New title for todo' }),
      ).rejects.toThrowError(new NotFoundException('Todo Not Found.'));
    });

    it('should return error if user does not own todo.', async () => {
      const mockUpdateTodo = jest.fn().mockReturnValue(mockTodo);

      jest
        .spyOn(prismaService.todo, 'update')
        .mockImplementation(mockUpdateTodo);

      await expect(
        todosService.updateTodo('not-a-valid-userId', id, {
          title: newTitle,
        }),
      ).rejects.toThrowError(new ForbiddenException('Not Authorized.'));
    });
  });

  describe('toggleIsCompletedTodo', () => {
    const id = '01e3f65e-fd2c-4f90-894a-fffa8f41c39c';
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todo.toggleIsCompletedTodo and toggle todo isCompleted state.', async () => {
      const mockToggleIsCompletedTodo = jest.fn().mockReturnValue(mockTodo);

      jest
        .spyOn(prismaService.todo, 'update')
        .mockImplementation(mockToggleIsCompletedTodo);

      const isCompleted = await todosService.toggleIsCompletedTodo(userId, id);

      expect(mockToggleIsCompletedTodo).toBeCalledWith({
        where: {
          id,
        },
        data: {
          isCompleted: !isCompleted,
        },
      });
    });

    it('should return error if no todo exist.', async () => {
      const mockToggleIsCompletedTodo = jest.fn().mockReturnValue(null);

      jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockImplementation(mockToggleIsCompletedTodo);

      await expect(
        todosService.toggleIsCompletedTodo(userId, id),
      ).rejects.toThrowError(new NotFoundException('Todo Not Found.'));
    });

    it('should return error if user does not own todo.', async () => {
      const mockToggleIsCompletedTodo = jest.fn().mockReturnValue(mockTodo);

      jest
        .spyOn(prismaService.todo, 'update')
        .mockImplementation(mockToggleIsCompletedTodo);

      await expect(
        todosService.toggleIsCompletedTodo('not-a-valid-userId', id),
      ).rejects.toThrowError(new ForbiddenException('Not Authorized.'));
    });
  });

  describe('deleteTodo', () => {
    const id = '01e3f65e-fd2c-4f90-894a-fffa8f41c39c';
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    it('should call prisma todo.deleteTodo and delete todo.', async () => {
      const mockDeleteTodo = jest.fn().mockReturnValue(true);

      jest
        .spyOn(prismaService.todo, 'delete')
        .mockImplementation(mockDeleteTodo);

      await todosService.deleteTodo(userId, id);

      expect(mockDeleteTodo).toBeCalledWith({
        where: {
          id,
        },
      });
    });

    it('should return error if no todo exist.', async () => {
      const mockDeleteTodo = jest.fn().mockReturnValue(null);

      jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockImplementation(mockDeleteTodo);

      await expect(todosService.deleteTodo(userId, id)).rejects.toThrowError(
        new NotFoundException('Todo Not Found.'),
      );
    });

    it('should return error if user does not own todo.', async () => {
      const mockDeleteTodo = jest.fn().mockReturnValue(mockTodo);

      jest
        .spyOn(prismaService.todo, 'delete')
        .mockImplementation(mockDeleteTodo);

      await expect(
        todosService.deleteTodo('not-a-valid-userId', id),
      ).rejects.toThrowError(new ForbiddenException('Not Authorized.'));
    });
  });

  describe('getTodoById', () => {
    const id = '01e3f65e-fd2c-4f90-894a-fffa8f41c39c';

    it('should call prisma todo.getTodoById and return a single todo.', async () => {
      const mockGetTodoById = jest.fn().mockReturnValue(mockTodo);

      jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockImplementation(mockGetTodoById);

      await todosService.getTodoById(id);

      expect(mockGetTodoById).toBeCalledWith({
        where: {
          id,
        },
      });
    });

    it('should return error if no todo exist.', async () => {
      const mockGetTodoById = jest.fn().mockReturnValue(null);

      jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockImplementation(mockGetTodoById);

      await expect(todosService.getTodoById(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
