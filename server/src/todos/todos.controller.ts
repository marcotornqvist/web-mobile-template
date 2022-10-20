import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { Todo, User } from '@prisma/client';
import { TodoEntity } from './entities/todo.entity';
import { TodoDto } from './dto/todo.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CurrentUser } from 'auth/current-user.decorator';
import { SwaggerHeaderAuthMessage } from 'utils/swaggerMessages';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('')
  @Get()
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  getAllTodos(): Promise<Todo[]> {
    return this.todosService.getAllTodos();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  getAllTodosByMe(@CurrentUser() user: User): Promise<Todo[]> {
    return this.todosService.getAllTodosByMe(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiCreatedResponse({ type: TodoEntity })
  createTodo(@CurrentUser() user: User, @Body() body: TodoDto): Promise<Todo> {
    return this.todosService.createTodo(user.id, body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: TodoEntity })
  updateTodo(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: TodoDto,
  ): Promise<Todo> {
    return this.todosService.updateTodo(user.id, id, body);
  }

  @Patch('toggleIsCompleted/:id')
  @UseGuards(JwtAuthGuard)
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: Boolean })
  toggleIsCompletedTodo(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<boolean> {
    return this.todosService.toggleIsCompletedTodo(user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiHeader(SwaggerHeaderAuthMessage)
  @ApiOkResponse({ type: Boolean })
  deleteTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.todosService.deleteTodo(user.id, id);
  }
}
