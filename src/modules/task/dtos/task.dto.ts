import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { CategoryDto } from 'src/modules/category/dtos/catergory.dto';

export class ListItemDto {
  @IsString()
  @IsNotEmpty ()
  @Expose()
  body: string;

  @Expose()
  _id: string;
}
export class TaskDto {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Exclude()
  userId: Types.ObjectId;
  @Expose()
  @Type(() => CategoryDto)
  categoryId: CategoryDto;
  @Expose()
  isPrivate: boolean;
  @Expose()
  taskType: 'text' | 'list';
  @Expose()
  body?: string;
  @Expose()
  @Type(() => ListItemDto)
  items?: ListItemDto[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
