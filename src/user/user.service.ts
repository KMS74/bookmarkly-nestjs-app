import { EditUserDto } from './dtos/edit-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async editUser(userId: number, editUserDto: EditUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...editUserDto,
      },
    });

    delete updatedUser.hash;

    return updatedUser;
  }
}
