import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';
import { CategoryModule } from '../category/category.module';
import { UtilitiesModule } from '../utilities/utilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    CategoryModule,
    UtilitiesModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
