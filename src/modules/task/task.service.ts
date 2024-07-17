import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CategoryService } from './../category/category.service';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTasksQueryDto } from './dtos/query..dto';
import { UtilitiesService } from './../utilities/utilities.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly categoryService: CategoryService,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    //check the category
    const categoryExist = await this.categoryService.findById(
      userId,
      createTaskDto.categoryId,
    );
    if (!categoryExist) {
      throw new NotFoundException('Wrong Category ID');
    }
    //create the task
    const newTask = new this.taskModel({ ...createTaskDto, userId });
    if (newTask.taskType === 'text') {
      newTask.items = undefined;
    } else {
      newTask.body = undefined;
    }
    return (await newTask.save()).populate('categoryId', 'name');
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ) {
    //check the task
    const taskExist = await this.findById(taskId, userId);
    if (!taskExist) {
      throw new NotFoundException('Wrong task ID');
    }
    //check the category
    if (updateTaskDto.categoryId) {
      const categoryExist = await this.categoryService.findById(
        userId,
        updateTaskDto.categoryId,
      );
      if (!categoryExist) {
        throw new NotFoundException('Wrong Category ID');
      }
    }

    // Update task properties based on the type
    if (taskExist.taskType === 'text') {
      updateTaskDto.items = undefined;
    } else if (taskExist.taskType === 'list') {
      updateTaskDto.body = undefined;
    }

    Object.assign(taskExist, updateTaskDto);
    return (await taskExist.save()).populate('categoryId', 'name');
  }

  async getTasks(userId: string | null, query: GetTasksQueryDto) {
    const filter = this.filterBuilder(query, userId);
    const { populate, sort } = this.sortBuilder(query);
    const { limit, skip } = this.utilitiesService.paginate(
      query.page,
      query.size,
    );
    const tasks = await this.taskModel
      .find(filter)
      .sort(sort)
      .populate(populate)
      .limit(limit)
      .skip(skip);
    return tasks;
  }

  async deleteTask(userId: string, taskId: string) {
    const taskExist = await this.findById(taskId, userId);
    if (!taskExist) {
      throw new NotFoundException('Wrong task ID');
    }
    await this.taskModel.findOneAndDelete({ _id: taskId, userId });
  }
  async getTaskById(userId: string | null, taskId: string) {
    const task = await this.taskModel.findOne({ _id: taskId });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (
      task.isPrivate &&
      JSON.stringify(task.userId) !== JSON.stringify(userId)
    ) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  //helpers
  sortBuilder(query: GetTasksQueryDto) {
    const { sortBy, sortOrder } = query;

    const sort = {};
    let categorySort = {};
    if (sortBy === 'isPrivate') {
      sort['isPrivate'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'category') {
      categorySort = { sort: { name: sortOrder === 'desc' ? -1 : 1 } };
    }
    const populate = {
      path: 'categoryId',
      options: categorySort, // Sort by category name
      select: 'name',
    };
    return { populate, sort };
  }

  filterBuilder(query: GetTasksQueryDto, userId: string) {
    const { category, isPrivate } = query;
    let filter = {};

    //handle if auth or not
    if (userId) {
      if (isPrivate) {
        filter['isPrivate'] = isPrivate;
        if (isPrivate === 'true') {
          filter['userId'] = userId;
        }
      }
    } else {
      filter['isPrivate'] = false;
    }

    //category
    if (category) {
      filter['categoryId'] = category;
    }
    return filter;
  }
  //findings
  findByName(name: string, userId: string) {
    return this.taskModel.findOne({ name, userId }, { userId: 0 });
  }
  findById(taskId: string, userId: string) {
    return this.taskModel.findOne({ _id: taskId, userId }, { userId: 0 });
  }

  findAll() {}
}
