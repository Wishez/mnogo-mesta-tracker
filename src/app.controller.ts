import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task/task.service';

@Controller('app')
export class AppController {
  constructor(private readonly taskService: TaskService) {}

  @Get('check/cells')
  checkCells() {
    return this.taskService.checkCells();
  }
}
