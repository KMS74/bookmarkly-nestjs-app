import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// this makes the module global and makes all exported providers available to all modules in the application
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
