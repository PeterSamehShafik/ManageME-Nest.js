import {
  IsNotEmpty,
  IsString,  
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ListItemDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  categoryId?: string;

  @IsNotEmpty()
  @IsOptional()
  isPrivate?: boolean;

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
