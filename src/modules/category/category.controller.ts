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
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { createCategoryDto } from './dtos/create.dto';
import { updateCategoryDto } from './dtos/update-category.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CategoryDto } from './dtos/catergory.dto';

@Controller('category')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createCategory(
    @Body() body: createCategoryDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.categoryService.createCategory(body, user._id);
  }

  @Get()
  myCategories(@CurrentUser() user: UserDto) {
    return this.categoryService.myCategories(user._id);
  }

  @Get('/:id')
  getCategory(@Param('id') categoryId: string, @CurrentUser() user: UserDto) {
    return this.categoryService.getCategory(user._id, categoryId);
  }
  @Put('/:id')
  updateCategory(
    @Body() body: updateCategoryDto,
    @Param('id') categoryId: string,
    @CurrentUser() user: UserDto,
  ) {
    return this.categoryService.updateCategory(user._id, categoryId, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  deleteCategory(
    @Param('id') categoryId: string,
    @CurrentUser() user: UserDto,
  ) {
    return this.categoryService.deleteCategory(user._id, categoryId);
  }
}
