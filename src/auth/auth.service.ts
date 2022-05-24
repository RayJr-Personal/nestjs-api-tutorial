import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

  async signup(dto: AuthDto) {
    try {
      // generate pwd hash
      const hash = await argon.hash(dto.password);

      // save new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // Below is unoptimal - will need to do this in every db operation
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });

      // Below is dirty, will replace with transformer later
      delete user.hash;

      // return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Error with Request
        if (error.code === 'P2002') {
          // Violated unique constraint (see docs)

          // ForbiddenException is from NestJS (see docs)
          throw new ForbiddenException('Credentials taken');
        }
      }
      // If it's not an error from Prisma
      throw error;
    }
  }

  signin() {
    return 'Signin';
  }
}
