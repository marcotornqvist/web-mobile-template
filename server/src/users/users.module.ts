import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from 'auth/auth.service';
import { TodosService } from 'todos/todos.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, TodosService],
  exports: [UsersService],
})
export class UsersModule {}
