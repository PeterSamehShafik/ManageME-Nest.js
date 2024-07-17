import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDto } from '../user/dtos/user.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { query } from 'express';
import { GetTasksQueryDto } from './dtos/query..dto';

@Controller('task')
// @Serialize(TaskDto)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.taskService.createTask(createTaskDto, user._id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.taskService.updateTask(taskId, updateTaskDto, user._id);
  }

  @Get()
  getTasks(
    @CurrentUser() user: UserDto | null,
    @Query() query: GetTasksQueryDto,
  ) {
    return this.taskService.getTasks(user ? user._id : null, query);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') taskId: string,
    @CurrentUser() user: UserDto | null,
  ) {
    return this.taskService.getTaskById(user?._id, taskId);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  deleteTask(@Param('id') taskId: string, @CurrentUser() user: UserDto) {
    return this.taskService.deleteTask(user._id, taskId);
  }
}
