import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dtos';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async login(authDto: AuthDto) {
    const { email, password } = authDto;
    // find user by email
    const user = await this.prisma.user.findUnique({
      omit: {
        hash: false, // not omit the hash field from the user model locally to compare the password hash
      },
      where: {
        email,
      },
    });

    // if user not found, throw exception
    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }
    // compare password hash with the hash in the database
    const isPasswordValid = await argon.verify(user.hash, password);
    // if password is incorrect, throw exception
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid login credentials');
    }

    const accessToken = await this.signToken(user.id, user.email);

    return {
      accessToken,
    };
  }
  async signup(authDto: AuthDto) {
    const { email, password } = authDto;

    const passwordHash = await argon.hash(password);
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException(`User's email already exists`);
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        hash: passwordHash,
      },
    });

    return newUser;
  }

  // private method to sign JWT token with user id and email
  private signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      expiresIn: '1d', // token expires in 1 day
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
