import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListItemDto } from './task.dto';

enum TaskType {
  Text = 'text',
  List = 'list',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  isPrivate: boolean;

  @IsEnum(TaskType)
  @IsNotEmpty()
  taskType: TaskType;

  @IsString()
  @IsOptional()
  body?: string; // Only required for "text" type

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ListItemDto)
  @IsOptional()
  items?: ListItemDto[]; // Only required for "list" type
}
