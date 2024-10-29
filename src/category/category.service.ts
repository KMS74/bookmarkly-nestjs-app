import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories(userId: number) {
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
      },
      include: {
        bookmarks: true,
      },
    });
    return categories;
  }

  async getBookmarksByCategory(categoryId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        categoryId,
      },
    });

    return bookmarks;
  }

  async createCategory(userId: number, createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        userId,
        ...createCategoryDto,
      },
    });

    return category;
  }

  async updateCategory(
    userId: number,
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category || category.userId !== userId) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...updateCategoryDto,
      },
    });

    return updatedCategory;
  }

  async deleteCategory(userId: number, categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category || category.userId !== userId) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    // update bookmarks that are associated with the category to have categoryId null
    // this will remove the association between the category and the bookmarks

    await this.prisma.bookmark.updateMany({
      where: {
        categoryId,
      },
      data: {
        categoryId: null,
      },
    });

    // delete the category
    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
