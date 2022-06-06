import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
// Route is plural (NestJS)
@Controller('users')
export class UserController {
  // @UseGuards hecks & processes requests
  // AuthGuard('jwt') links to JwtStrategy > PaswordStrategy's parameter
  // parameter is 'jwt' by default if not specified but can be changed
  // Similar to ids
  // AuthGuard gets replaced by JwtGuard (custom guard) for
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
