import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

// Controller receives request, calls function in auth.service;
// "Dependency injection"

// Needs to instantiate an auth.service class
// To avoid having to manage where things are instantiated,
// avoid instantiating it yourself, Nest will do it for you:

@Controller('auth')
export class AuthController {
  // "private" declares and initializes the authService member in the same location
  constructor(private authService: AuthService) {
    this.authService.test();
  }

  // Avoid using the Request object of underlying library (@Req() req: x)
  // May need to switch from Express to something else
  // Prevents reusability
  // use NestJS' @Body dto: x

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log({ dto });
    return this.authService.signup();
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
