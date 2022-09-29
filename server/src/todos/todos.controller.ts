import { Controller, Get } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller()
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getHello(): string {
    return this.todosService.getTodos();
  }
}
