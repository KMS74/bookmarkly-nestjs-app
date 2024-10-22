import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// this makes the module global and makes the PrismaService available to all modules
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
