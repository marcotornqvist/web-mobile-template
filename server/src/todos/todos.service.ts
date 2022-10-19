import { PrismaService } from 'prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { TodoDto } from './dto/todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return todos;
  }

  getAllTodosByMe(userId: string): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createTodo(userId: string, { title }: TodoDto): Promise<Todo> {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          title,
          userId,
        },
      });

      return todo;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Todo could not be created.');
    }
  }

  async updateTodo(
    userId: string,
    id: string,
    { title }: TodoDto,
  ): Promise<Todo> {
    // Check that todo exists
    const todo = await this.getTodoById(id);

    if (userId !== todo.userId) {
      throw new ForbiddenException('Not Authorized.');
    }

    try {
      // Updates the title of the todo
      const updatedTodo = this.prisma.todo.update({
        where: {
          id,
        },
        data: {
          title,
        },
      });

      return updatedTodo;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Todo could not be updated.');
    }
  }

  async toggleIsCompletedTodo(userId: string, id: string): Promise<boolean> {
    // Check that todo exists
    const todo = await this.getTodoById(id);

    if (userId !== todo.userId) {
      throw new ForbiddenException('Not Authorized.');
    }

    try {
      // Toggle isCompleted from true to false and vice versa
      const { isCompleted } = await this.prisma.todo.update({
        where: {
          id,
        },
        data: {
          isCompleted: !todo.isCompleted,
        },
        select: {
          isCompleted: true,
        },
      });

      return isCompleted;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Todo completed state could not be toggled.',
      );
    }
  }

  async deleteTodo(userId: string, id: string) {
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

      return true;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Todo could not be deleted.');
    }
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
