import { BookmarkService } from './bookmark.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dtos';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  private logger = new Logger(BookmarkController.name);
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  async getBookmarks(@GetUser('id') userId: number) {
    this.logger.log(`user ${userId} requested bookmarks`);
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.log(`user ${userId} requested bookmark ${id}`);
    return this.bookmarkService.getBookmarkById(userId, id);
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    this.logger.log(`user ${userId} requested to create a bookmark`);
    return this.bookmarkService.createBookmark(userId, createBookmarkDto);
  }

  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    this.logger.log(`user ${userId} requested to update bookmark ${id}`);
    return this.bookmarkService.updateBookmark(userId, id, updateBookmarkDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.log(`user ${userId} requested to delete bookmark ${id}`);
    return this.bookmarkService.deleteBookmark(userId, id);
  }
}
