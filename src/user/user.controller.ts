import { Controller, Get, UseGuards } from '@nestjs/common';

// Plural (NestJS)
@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe() {
    return 'user info';
  }
}
