import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// export makes this class available to other files
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
