import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { Todo } from '@prisma/client';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: TodoEntity, isArray: true })
  async getAllTodos(): Promise<Todo[]> {
    return this.todosService.getAllTodos();
  }

  // @Get('me')
  // @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: TodoEntity, isArray: true })
  // async getAllTodosByMe(@CurrentUser() user: User): Promise<Todo[]> {
  //   return this.todosService.getAllTodosByMe(user.id);
  // }

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // @ApiCreatedResponse({ type: TodoEntity })
  // async createTodo(
  //   @Body() body: CreateTodoDto,
  //   @Req() request: Request,
  //   @CurrentUser() user: User,
  // ): Promise<Todo> {
  //   return this.todosService.createTodo(
  //     user.id,
  //     body,
  //     request.cookies?.Authentication,
  //   );
  // }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: TodoEntity })
  // async updateTodo(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() body: CreateTodoDto,
  //   @CurrentUser() user: User,
  // ): Promise<Todo> {
  //   return this.todosService.updateTodo(user.id, id, body);
  // }

  // @Patch('toggleIsCompleted/:id')
  // @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: Boolean })
  // async toggleIsCompletedTodo(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @CurrentUser() user: User,
  // ): Promise<boolean> {
  //   return this.todosService.toggleIsCompletedTodo(user.id, id);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: Boolean })
  // async deleteTodo(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @CurrentUser() user: User,
  // ): Promise<boolean> {
  //   return this.todosService.deleteTodo(user.id, id);
  // }
}
