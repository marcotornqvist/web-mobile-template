import { PrismaService } from 'prisma/prisma.service';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Todo } from '@prisma/client';
import { TodoDto } from './dto/todo.dto';

const ttl = 60 * 60;

@Injectable()
export class TodosService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return todos;
  }

  async getAllTodosByMe(userId: string): Promise<Todo[]> {
    const { cachedTodos, cacheKey } = await this.getCachedTodosByMe(userId);

    if (cachedTodos) {
      return cachedTodos;
    }

    const todos = await this.prisma.todo.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cacheService.set<Todo[]>(cacheKey, todos, { ttl });

    return todos;
  }

  async createTodo(userId: string, { title }: TodoDto): Promise<Todo> {
    const { cachedTodos, cacheKey } = await this.getCachedTodosByMe(userId);

    try {
      const todo = await this.prisma.todo.create({
        data: {
          title,
          userId,
        },
      });

      if (cachedTodos) {
        const todos = [todo, ...cachedTodos];

        await this.cacheService.set<Todo[]>(cacheKey, todos, {
          ttl,
        });
      }

      return todo;
    } catch (err) {
      await this.cacheService.del(cacheKey);
      throw new InternalServerErrorException('Todo could not be created.');
    }
  }

  async updateTodo(
    userId: string,
    id: string,
    { title }: TodoDto,
  ): Promise<Todo> {
    const { cachedTodos, cacheKey } = await this.getCachedTodosByMe(userId);

    // Check that todo exists
    const todo = await this.getTodoById(id);

    if (userId !== todo.userId) {
      throw new ForbiddenException('Not Authorized.');
    }

    try {
      // Updates the title of the todo
      const updatedTodo = await this.prisma.todo.update({
        where: {
          id,
        },
        data: {
          title,
        },
      });

      if (cachedTodos) {
        const todos = cachedTodos.map((item) =>
          item.id === id ? updatedTodo : item,
        );

        await this.cacheService.set<Todo[]>(cacheKey, todos, {
          ttl,
        });
      }

      return updatedTodo;
    } catch (err) {
      console.log(err);
      await this.cacheService.del(cacheKey);
      throw new InternalServerErrorException('Todo could not be updated.');
    }
  }

  async toggleIsCompletedTodo(userId: string, id: string): Promise<boolean> {
    const { cachedTodos, cacheKey } = await this.getCachedTodosByMe(userId);

    // Check that todo exists
    const todo = await this.getTodoById(id);

    if (userId !== todo.userId) {
      throw new ForbiddenException('Not Authorized.');
    }

    try {
      // Toggle isCompleted from true to false and vice versa
      const updatedTodo = await this.prisma.todo.update({
        where: {
          id,
        },
        data: {
          isCompleted: !todo.isCompleted,
        },
      });

      if (cachedTodos) {
        const todos = cachedTodos.map((item) =>
          item.id === id ? updatedTodo : item,
        );

        await this.cacheService.set<Todo[]>(cacheKey, todos, {
          ttl,
        });
      }

      return updatedTodo.isCompleted;
    } catch (err) {
      console.log(err);
      await this.cacheService.del(cacheKey);
      throw new InternalServerErrorException(
        'Todo completed state could not be toggled.',
      );
    }
  }

  async deleteTodo(userId: string, id: string) {
    const { cachedTodos, cacheKey } = await this.getCachedTodosByMe(userId);

    // Check that todo exists
    const todo = await this.getTodoById(id);

    if (userId !== todo.userId) {
      throw new ForbiddenException('Not Authorized.');
    }

    try {
      // Delete todo
      await this.prisma.todo.delete({
        where: {
          id,
        },
      });

      if (cachedTodos) {
        const todos = cachedTodos.filter((item) => item.id !== id);

        await this.cacheService.set<Todo[]>(cacheKey, todos, {
          ttl,
        });
      }

      return true;
    } catch (err) {
      console.log(err);
      await this.cacheService.del(cacheKey);
      throw new InternalServerErrorException('Todo could not be deleted.');
    }
  }

  // returns the cachedTodos for the logged in user and the cacheKey
  async getCachedTodosByMe(
    userId: string,
  ): Promise<{ cachedTodos: Todo[] | undefined; cacheKey: string }> {
    const cacheKey = `todos/me-${userId}`;
    const cachedTodos: Todo[] | undefined = await this.cacheService.get(
      cacheKey,
    );

    return {
      cachedTodos,
      cacheKey,
    };
  }

  async getTodoById(id: string): Promise<Todo> {
    // Find todo by id
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Throw an error if todo doesn't exist
    if (!todo) {
      throw new NotFoundException('Todo Not Found.');
    }

    return todo;
  }
}
