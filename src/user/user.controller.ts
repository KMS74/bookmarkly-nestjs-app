import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dtos';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    this.logger.log(`user ${user.id} requested their profile`);
    return user;
  }

  @Patch('me')
  editUser(@GetUser('id') userId: number, @Body() editUserDto: EditUserDto) {
    this.logger.log(`user ${userId} requested to edit their profile`);
    return this.userService.editUser(userId, editUserDto);
  }
}
