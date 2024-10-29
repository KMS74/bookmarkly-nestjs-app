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

  async addBookmarkToCategory(
    categoryId: number,
    bookmarkId: number,
    userId: number,
  ) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!category || category.userId !== userId) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    if (!bookmark || bookmark.userId !== userId) {
      throw new NotFoundException(`Bookmark with id ${bookmarkId} not found`);
    }

    return await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      include: {
        category: true,
      },
      data: {
        categoryId,
      },
    });
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

  async deleteBookmarkFromCategory(
    categoryId: number,
    bookmarkId: number,
    userId: number,
  ) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!category || category.userId !== userId) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    if (!bookmark || bookmark.userId !== userId) {
      throw new NotFoundException(`Bookmark with id ${bookmarkId} not found`);
    }

    // remove the association between the category and the bookmark
    await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        bookmarks: {
          disconnect: { id: bookmarkId },
        },
      },
    });
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
