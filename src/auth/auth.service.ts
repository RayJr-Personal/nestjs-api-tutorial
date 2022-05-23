import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// Gets "injected" to whatever called it in the controller file
// Don't worry about specifying what data type to return!

@Injectable()
export class AuthService {
  // Doesn't actually work even if PrismaModule is imported in AuthModule
  // Because PrismaModule isn't actually exporting PrismaService
  // This also means you have to do it in all other modules (User, Bookmark, etc.)
  // Solution is @Global in PrismaModule
  constructor(private prisma: PrismaService) {}

  test() {
    console.log('hello!');
  }

  signup() {
    return { msg: 'Signup' };
  }

  signin() {
    return 'Signin';
  }
}
