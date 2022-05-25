import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({}), JwtStrategy],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
// export makes this class available to other files
export class AuthModule {}
