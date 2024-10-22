import {
  Body,
  Controller,
  Post,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    this.logger.log('user signup request');
    return this.authService.signup(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() authDto: AuthDto) {
    this.logger.log('user login request');
    return this.authService.login(authDto);
  }
}
