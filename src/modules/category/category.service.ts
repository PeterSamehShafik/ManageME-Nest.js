import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { createCategoryDto } from './dtos/create.dto';
import { updateCategoryDto } from './dtos/update-category.dto';
import { Task, TaskDocument } from '../task/schema/task.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  async createCategory(body: createCategoryDto, userId: string) {
    const { name } = body;
    const exist = await this.findByName(name, userId);
    if (exist) {
      throw new ConflictException(
        'Category with this name already exists for the user',
      );
    }
    const newCategory = new this.categoryModel({
      name,
      userId,
    });
    return newCategory.save();
  }
  async myCategories(userId: string) {
    const categories = await this.findAll(userId);
    if (!categories.length) {
      throw new NotFoundException('No categories found');
    }
    return categories;
  }
  async getCategory(userId: string, categoryId: string) {
    const category = await this.findById(userId, categoryId);
    if (!category) {
      throw new NotFoundException('Wrong Category not found');
    }
    return category;
  }

  async deleteCategory(userId: string, categoryId: string) {
    const category = await this.findById(userId, categoryId);
    if (!category) {
      throw new NotFoundException('Wrong Category not found');
    }
    await this.taskModel.deleteMany({ categoryId });
    await this.categoryModel.findOneAndDelete({ _id: categoryId, userId });
  }
  async updateCategory(
    userId: string,
    categoryId: string,
    body: updateCategoryDto,
  ) {
    const category = await this.findById(userId, categoryId);
    if (!category) {
      throw new NotFoundException('Wrong Category not found');
    }
    const exist = await this.findByName(body.name, userId);
    if (exist) {
      throw new ConflictException(
        'Category with this name already exists for the user',
      );
    }
    Object.assign(category, body);
    return category.save();
  }

  //findings
  findByName(name: string, userId: string) {
    return this.categoryModel.findOne({ name, userId });
  }
  findById(userId: string, categoryId: string) {
    return this.categoryModel.findOne(
      { userId, _id: categoryId },
      { userId: 0 },
    );
  }
  findAll(userId: string): Promise<Category[]> {
    return this.categoryModel.find({ userId }, { userId: 0 });
  }
}
