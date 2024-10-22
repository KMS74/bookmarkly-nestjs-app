import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // we want to check the expiration date
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const { sub } = payload;
    // find user by id
    const user = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // delete the password hash from the user object
    delete user.hash;

    return user;
  }
}
