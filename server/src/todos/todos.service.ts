import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // async getAllTodosByMe(userId: string): Promise<Todo[]> {
  //   return this.prisma.todo.findMany({
  //     where: {
  //       userId,
  //     },
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });
  // }

  // async createTodo(
  //   userId: string,
  //   { title }: CreateTodoDto,
  //   authentication: string,
  // ): Promise<Todo> {
  //   try {
  //     const todo = await this.prisma.todo.create({
  //       data: {
  //         title,
  //         userId,
  //       },
  //     });

  //     // Emit todo to notification service
  //     this.notificationClient.emit('todo_created', {
  //       todo,
  //       Authentication: authentication,
  //     });

  //     return todo;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  // async updateTodo(
  //   userId: string,
  //   id: string,
  //   { title }: CreateTodoDto,
  // ): Promise<Todo> {
  //   // Check that todo exists
  //   const todo = await this.getTodoById(id);

  //   if (userId !== todo.userId) {
  //     throw new ForbiddenException('Not Authorized.');
  //   }

  //   // Updates the title of the todo
  //   return this.prisma.todo.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       title,
  //     },
  //   });
  // }

  // async toggleIsCompletedTodo(userId: string, id: string): Promise<boolean> {
  //   // Check that todo exists
  //   const todo = await this.getTodoById(id);

  //   if (userId !== todo.userId) {
  //     throw new ForbiddenException('Not Authorized.');
  //   }

  //   // Toggle isCompleted from true to false and vice versa
  //   const { isCompleted } = await this.prisma.todo.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       isCompleted: !todo.isCompleted,
  //     },
  //     select: {
  //       isCompleted: true,
  //     },
  //   });

  //   return isCompleted;
  // }

  // async deleteTodo(userId: string, id: string): Promise<boolean> {
  //   // Check that todo exists
  //   const todo = await this.getTodoById(id);

  //   if (userId !== todo.userId) {
  //     throw new ForbiddenException('Not Authorized.');
  //   }

  //   // Delete todo
  //   await this.prisma.todo.delete({
  //     where: {
  //       id,
  //     },
  //   });

  //   return true;
  // }

  // private async getTodoById(id: string): Promise<Todo> {
  //   // Find todo by id
  //   const todo = await this.prisma.todo.findUnique({
  //     where: {
  //       id,
  //     },
  //   });

  //   // Throw an error if todo doesn't exist
  //   if (!todo) {
  //     throw new NotFoundException('Todo Not Found.');
  //   }

  //   return todo;
  // }
}
