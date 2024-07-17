import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsBoolean,
  IsNumberString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetTasksQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  @IsEnum(['true', 'false'])
  @IsOptional()
  isPrivate?: string;

  @IsOptional()    
  @IsNumberString()
  page?: number;

  @IsOptional()    
  @IsNumberString()
  size?: number;

  @IsOptional()
  @IsString()
  @IsEnum(['category', 'isPrivate'])
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
