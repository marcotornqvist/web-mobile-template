import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { Todo, User } from '@prisma/client';
import { TodoEntity } from './entities/todo.entity';
import { TodoDto } from './dto/todo.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  getAllTodos(): Promise<Todo[]> {
    return this.todosService.getAllTodos();
  }

  @Get('me')
  // @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  getAllTodosByMe(): // @CurrentUser() user: User
  Promise<Todo[]> {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';
    return this.todosService.getAllTodosByMe(userId);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: TodoEntity })
  createTodo(
    @Body() body: TodoDto,
    @Req() request: Request,
    // @CurrentUser() user: User,
  ): Promise<Todo> {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    return this.todosService.createTodo(
      // user.id,
      userId,
      body,
      // request.cookies?.Authentication,
    );
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TodoEntity })
  updateTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: TodoDto,
    // @CurrentUser() user: User,
  ): Promise<Todo> {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    return this.todosService.updateTodo(
      // user.id,
      userId,
      id,
      body,
    );
  }

  @Patch('toggleIsCompleted/:id')
  // @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean })
  toggleIsCompletedTodo(
    @Param('id', ParseUUIDPipe) id: string,
    // @CurrentUser() user: User,
  ): Promise<boolean> {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    return this.todosService.toggleIsCompletedTodo(
      userId,
      // user.id,
      id,
    );
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean })
  deleteTodo(
    @Param('id', ParseUUIDPipe) id: string,
    // @CurrentUser() user: User,
  ): Promise<boolean> {
    const userId = '74783f1d-22a1-4cb8-bb80-dff508883a23';

    return this.todosService.deleteTodo(
      userId,
      // user.id,
      id,
    );
  }
}
