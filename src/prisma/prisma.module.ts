import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// PrismaClient allows DB connection

// @Global makes this available to all other modules
// Ensure this is imported in AppModule
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
