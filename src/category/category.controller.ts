import { CategoryService } from './category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories(@GetUser('id') userId: number) {
    return this.categoryService.getCategories(userId);
  }

  @Get(':categoryId/bookmarks')
  async getBookmarksByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.getBookmarksByCategory(categoryId);
  }

  @Post()
  createCategory(
    @GetUser('id') userId: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(userId, createCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':categoryId/bookmarks/:bookmarkId')
  async addBookmarkToCategory(
    @GetUser('id') userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    return this.categoryService.addBookmarkToCategory(
      categoryId,
      bookmarkId,
      userId,
    );
  }

  @Patch(':categoryId')
  updateCategory(
    @GetUser('id') userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(
      userId,
      categoryId,
      updateCategoryDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':categoryId/bookmarks/:bookmarkId')
  async deleteBookmarkFromCategory(
    @GetUser('id') userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    return this.categoryService.deleteBookmarkFromCategory(
      categoryId,
      bookmarkId,
      userId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':categoryId')
  deleteCategory(
    @GetUser('id') userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.deleteCategory(userId, categoryId);
  }
}
